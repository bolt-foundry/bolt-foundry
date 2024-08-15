import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";
import { DGWord } from "packages/types/transcript.ts";

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

    // copy test video file to temp folder
    try {
      await Deno.copyFile("resources/testvideo.mp4", testVideoFilename);
      logger.info(`Test video file copied to ${testVideoFilename}`);
    } catch (error) {
      logger.error(
        `Failed to copy test video file to ${testVideoFilename}: ${error}`,
      );
      throw error;
    }

    logger.info(`To render clip: bff render -i ${testVideoFilename}`);
  }
}
