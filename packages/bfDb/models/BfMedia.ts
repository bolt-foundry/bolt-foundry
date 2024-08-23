import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";
import { DGWord } from "packages/types/transcript.ts";
import { render } from "infra/bff/friends/render.bff.ts";
import { fetchFile } from "lib/googleDriveApi.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfMediaAudio } from "packages/bfDb/models/BfMediaAudio.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";

const logger = getLogger(import.meta);

export type BfMediaProps = {
  filename: string;
  fileId: string | null;
};

type DownloadClipArgs = {
  file: {
    url: string;
    fileId?: string;
  };
  title: string;
  transcript: {
    start_time: number;
    end_time: number;
    transcript: Array<DGWord>;
  };
};

export class BfMedia extends BfNode<BfMediaProps> {
  static async findMediaByViewer(bfCurrentViewer: BfCurrentViewer) {
    const media = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return media;
  }

  static async createFromGoogleDriveResource(
    driveResource: BfGoogleDriveResource,
  ) {
    const bfMediaAudioPromise = BfMediaAudio.createFromGoogleDriveResource(
      driveResource,
    );
    const bfMedia = await this.create(driveResource.currentViewer, {});
    await BfEdge.createEdgeBetweenNodes(
      bfMedia.currentViewer,
      bfMedia,
      driveResource,
    );

    const bfMediaAudio = await bfMediaAudioPromise;
    await BfEdge.createEdgeBetweenNodes(bfMedia.currentViewer, bfMedia, bfMediaAudio);
    const bfMediaTranscript = await BfMediaTranscript.createFromBfMediaAudio(bfMediaAudio);
    await BfEdge.createEdgeBetweenNodes(bfMedia.currentViewer, bfMedia, bfMediaTranscript);

    return bfMedia;
  }

  async downloadClip(args: DownloadClipArgs) {
    const {
      file: {
        url,
        // "short video.mp4"
        fileId = "1JOvVaUjfMOzhvzkztbFyII6Oe7Qu9Hrh",
      },
      transcript,
      title,
    } = args;
    const fileroot = await Deno.makeTempFile();
    const transcriptFilename = `${fileroot}.json`;
    const testVideoFilename = `${fileroot}.mp4`;
    // HACK FOR DEMO, LIMIT TO 20 SECONDS
    // because replit runs out of disk space
    const transcriptOverride = {
      ...transcript,
      end_time: transcript.start_time + 20,
    };
    const fileContent = JSON.stringify(transcriptOverride, null, 2);
    try {
      await Deno.writeTextFile(transcriptFilename, fileContent);
      logger.info(`Transcript file created at ${transcriptFilename}`);
    } catch (error) {
      logger.error(
        `Failed to create transcript file at ${transcriptFilename}: ${error}`,
      );
      throw new Error(error);
    }

    // Download and save the file from Google Drive
    logger.info("File url", url);

    try {
      const currentViewerPerson = await BfPerson.findCurrentViewer(
        this.currentViewer,
      );
      const googleAuth = await currentViewerPerson?.getGoogleAuth();
      if (!googleAuth) {
        throw new Error("no google auth");
      }
      const accessToken = await googleAuth.getAccessToken();
      const response = await fetchFile(accessToken, fileId);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from Google Drive: ${response.statusText}`,
        );
      }
      const fileData = new Uint8Array(await response.arrayBuffer());
      await Deno.writeFile(testVideoFilename, fileData);
      logger.info(
        `File downloaded from Google Drive and saved to ${testVideoFilename}`,
      );
    } catch (error) {
      logger.error(`Failed to download file from Google Drive: ${error}`);
      throw new Error(error);
    }

    const renderCode = await render(["-i", testVideoFilename]);

    const extension = testVideoFilename.split(".").pop();
    const renderedFilename = testVideoFilename.replace(
      new RegExp(`\.${extension}$`),
      `_render.${extension}`,
    );

    // Hack for demo
    // Copy file from renderedFilename to {BF_ROOT}/build/downloads
    const formattedTitle = title
      ? `${sanitizeFilename(title)}.mp4`
      : renderedFilename.split("/").pop();
    const BFF_ROOT = Deno.env.get("BFF_ROOT") ?? Deno.cwd();
    const destinationPath = `${BFF_ROOT}/build/downloads/${formattedTitle}`;
    try {
      await Deno.copyFile(renderedFilename, destinationPath);
      logger.info(`File copied to ${destinationPath}`);
    } catch (error) {
      logger.error(`Failed to copy file to ${destinationPath}: ${error}`);
      throw new Error(error);
    }

    if (renderCode !== 0) {
      logger.error(`Error rendering ${renderedFilename}`);
      throw new Error(`Error rendering ${renderedFilename}`);
    }
    logger.info(`Rendered ${renderedFilename}`);
  }
}
