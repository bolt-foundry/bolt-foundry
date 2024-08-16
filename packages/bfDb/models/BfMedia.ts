import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";
import { DGWord } from "packages/types/transcript.ts";
import { render } from "infra/bff/friends/render.bff.ts";
import { fetchFile } from "lib/googleDriveApi.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";

const logger = getLogger(import.meta);

export type BfMediaProps = {
  filename: string;
};

type DownloadClipArgs = {
  file: {
    url: string;
  };
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

  example(args: unknown) {
    logger.info("this is an example job", this.currentViewer, args);
  }

  async downloadClip(args: DownloadClipArgs) {
    const { transcript } = args;
    const fileroot = await Deno.makeTempFile();
    const transcriptFilename = `${fileroot}.json`;
    const testVideoFilename = `${fileroot}.mp4`;
    const fileContent = JSON.stringify(transcript, null, 2);
    try {
      await Deno.writeTextFile(transcriptFilename, fileContent);
      logger.info(`Transcript file created at ${transcriptFilename}`);
    } catch (error) {
      logger.error(
        `Failed to create transcript file at ${transcriptFilename}: ${error}`,
      );
      throw error;
    }

    // Download and save the file from Google Drive
    const testVideoId = "1JOvVaUjfMOzhvzkztbFyII6Oe7Qu9Hrh"; // "short video.mp4"
    try {
      const currentViewerPerson = await BfPerson.findCurrentViewer(
        this.currentViewer,
      );
      const googleAuth = await currentViewerPerson?.getGoogleAuth();
      if (!googleAuth) {
        throw new Error("no google auth");
      }
      const accessToken = await googleAuth.getAccessToken();
      const response = await fetchFile(accessToken, testVideoId);
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
      throw error;
    }

    const renderCode = await render(["-i", testVideoFilename]);

    const extension = testVideoFilename.split(".").pop();
    const renderedFilename = testVideoFilename.replace(
      new RegExp(`\.${extension}$`),
      `_render.${extension}`,
    );

    if (renderCode !== 0) {
      logger.error(`Error rendering ${renderedFilename}`);
      throw new Error(`Error rendering ${renderedFilename}`);
    }
    logger.info(`Rendered ${renderedFilename}`);
  }
}
