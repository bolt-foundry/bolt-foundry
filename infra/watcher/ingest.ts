// https://www.npmjs.com/package/graphql-request
import { gql, GraphQLClient, rawRequest } from "infra/watcher/deps.ts";
import { addClipToNotion } from "infra/watcher/addClipToNotion.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

const USERNAME = Deno.env.get("BFI_USERNAME");
const PASSWORD = Deno.env.get("BFI_PASSWORD");
const GRAPHQL_ENDPOINT = Deno.env.get("BFI_GRAPHQL_ENDPOINT");
const FFMPEG_ARGS_EXCEPT_INPUT_AND_OUTPUT =
  Deno.env.get("BFI_FFMPEG_ARGS_EXCEPT_INPUT_AND_OUTPUT") ||
  "-vf crop=ih*(16/9):ih,scale=1920:1080 -c:v h264_videotoolbox -b:v 7M -c:a aac -b:a 128k -f segment -segment_time 1800 -reset_timestamps 1";
if (!GRAPHQL_ENDPOINT || !USERNAME || !PASSWORD) {
  throw new Error("BFI_GRAPHQL_ENDPOINT, BFI_USERNAME, BFI_PASSWORD not found");
}

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function processFile(filePath: string, name: string) {
  logger.info("processing file", filePath);
  const videoChunks = createVideoChunksForFilePath(filePath);
  for await (const chunk of videoChunks) {
    const uploadedLink = await processVideoChunk(chunk, name);
    // await notifyDiscord(`Uploaded video to ${uploadedLink}`);
    const output = await addClipToNotion(uploadedLink, name)
      .then((res) => res.json());
    logger.info(output);
    await notifyDiscord(`<@&1210008885193211944> New task: ${output.url}`);
  }
}

export async function chunkGoogleFile(filePath: string, name: string) {
  logger.info("processing file", filePath);
  const videoChunks = createVideoChunksForFilePath(filePath);
  for await (const chunk of videoChunks) {
    const _uploadedLink = await processVideoChunk(chunk, name);
  }
  //find a way to check sucess
  return true;
}

async function* createVideoChunksForFilePath(filePath: string) {
  logger.info(`creating video chunks for file ${filePath}`);
  const tmpDir = await Deno.makeTempDir();
  const outputFilePath = `${tmpDir}/output_%03d.mp4`;
  const ffmpegArgs = [
    "-i",
    filePath,
    ...FFMPEG_ARGS_EXCEPT_INPUT_AND_OUTPUT.split(" "),
    outputFilePath,
  ];

  const cmd = new Deno.Command("ffmpeg", {
    args: ffmpegArgs,
    env: Deno.env.toObject(),
    stdout: "piped",
    stderr: "piped", // Also capture stderr for more detailed logs
  });

  const ffmpegProcess = cmd.spawn();
  let previousSegmentPath = null;

  for await (const chunk of ffmpegProcess.stderr) {
    const outputLine = new TextDecoder().decode(chunk);
    if (outputLine.includes("time=")) {
      logger.info(outputLine);
    }
    const newFileMatch = outputLine.match(
      /Opening '(.+?\/output_\d+\.mp4)' for writing/,
    );

    if (newFileMatch) {
      const segmentPath = newFileMatch[1];

      if (previousSegmentPath) {
        logger.info(`finished writing ${previousSegmentPath}`);
        yield previousSegmentPath; // Yield when the previous segment is complete
      }

      logger.info(`new file ${segmentPath}`);
      previousSegmentPath = segmentPath;
    }
  }

  // Yield the final segment after the process is complete
  if (previousSegmentPath) {
    logger.info(`finished writing ${previousSegmentPath}`);
    yield previousSegmentPath;
  }

  const output = await ffmpegProcess.status;
  if (output.success) {
    logger.info("Finished processing", filePath);
  } else {
    logger.error("Failed to process", filePath);
  }
}

async function uploadToS3(filePath: string, s3Url: string) {
  logger.info(`uploading ${filePath} to ${s3Url}`);

  // Read the file into a buffer
  const fileBuffer = await Deno.readFile(filePath);

  const response = await fetch(s3Url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": fileBuffer.length.toString(), // Adding Content-Length header
    },
    body: fileBuffer,
  });

  if (response.ok) {
    logger.info("File uploaded successfully:", filePath);
  } else {
    logger.error("Error uploading file:", response.statusText);
    logger.error("HTTP status code:", response.status);
    const errorBody = await response.text();
    logger.error("Error details:", errorBody);
  }
}

async function processVideoChunk(chunkPath: string, name = chunkPath) {
  logger.info("processing video chunk", chunkPath);
  const project = await createProjectInBf(chunkPath, name);
  await uploadToS3(chunkPath, project.trackUploadUrl);
  const bfUrl = `https://boltfoundry.com/aws${project.url.slice(1)}`;
  logger.info(
    "uploaded to s3",
    chunkPath,
    bfUrl,
  );

  // append the link to a file in /tmp/files_uploaded.txt
  const uploadedLink = bfUrl;
  try {
    await Deno.writeTextFile("/tmp/files_uploaded.txt", `${uploadedLink}\n`, {
      append: true,
    });
  } catch (err) {
    logger.error("Error appending link to /tmp/files_uploaded.txt", err);
  }
  return uploadedLink;

  // logger.info(`successfully created ${notionLink}`);
}

export function notifyDiscord(content: string) {
  logger.info("notifying discord");
  const discordWebhookUrl = Deno.env.get("BFI_DISCORD_WEBHOOK_URL");
  if (!discordWebhookUrl) {
    logger.error("Discord webhook URL not found");
    return;
  }

  const payload = {
    content,
  };

  return fetch(discordWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        logger.error("Error sending Discord webhook:", response.statusText);
      } else {
        logger.info("Discord webhook sent successfully");
      }
    })
    .catch((error) => {
      logger.error("Error sending Discord webhook:", error);
    });
}

export async function createProjectInBf(chunkPath: string, name = chunkPath) {
  // get current access token
  const headers = await getHeaders();
  // create project on bf
  // get file from hard drive
  // stream file to s3
  // when stream is done return project
  const mutation = gql`
    mutation FileUploadCreateNewProjectMutation(
      $name: String!
      $height: Int!
      $width: Int!
      $language: String!
      $model: String!
      $usesOriginPrivateFileSystem: Boolean!) 

      {createProject
      (name: $name, 
      height: $height, 
      width: $width, 
      language: $language, 
      model: $model, 
      usesOriginPrivateFileSystem: $usesOriginPrivateFileSystem) {
        node {
          trackUploadUrl
          url
        }
      }
    }
  `;

  const variables = {
    name,
    height: 1080,
    width: 1920,
    language: "en",
    model: "assemblyai",
    usesOriginPrivateFileSystem: false,
  };

  const returned = await client.request(mutation, variables, headers);
  // @ts-expect-error not typing this lol.
  return returned.createProject.node;
}

export async function getHeaders() {
  // login mutation for graphql
  const loginMutation = gql`
  mutation LoginFormLoginMutation(
  $email: String!
  $password: String!
) {
  login(email: $email, password: $password) {
    name
    id
  }
}
`;
  if (!GRAPHQL_ENDPOINT) {
    throw new Error("GRAPHQL_ENDPOINT not found");
  }
  const { headers } = await rawRequest(GRAPHQL_ENDPOINT, loginMutation, {
    email: USERNAME,
    password: PASSWORD,
  });

  const setCookieHeader = headers.get("set-cookie");
  const returnableHeaders = new Headers();
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(",");
    const cookieEntry: Array<string> = [];
    cookies.forEach((cookie) => {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      cookieEntry.push(`${name}=${value}`);
    });
    returnableHeaders.append("cookie", cookieEntry.join(";"));
  }

  return returnableHeaders;
}
