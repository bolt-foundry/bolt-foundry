import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { render } from "infra/bff/friends/render.bff.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";
import {
  BfMediaNodeVideo,
  BfMediaNodeVideoRole,
  BfMediaNodeVideoStatus,
} from "packages/bfDb/models/BfMediaNodeVideo.ts";
import type { DGWord } from "packages/types/transcript.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfError } from "lib/BfError.ts";
import { BfMediaNodeVideoGoogleDriveResource } from "packages/bfDb/models/BfMediaNodeVideoGoogleDriveResource.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

export type BfSavedSearchResultProps = {
  title: string;
  body: string;
  description: string;
  topics: string;
  rationale: string;
  confidence: number;
  startTime: number;
  endTime: number;
  duration: number;
};

export class BfSavedSearchResult extends BfNode<BfSavedSearchResultProps> {
  getPreviewableForGraphql() {
    return {
      __typename: "VideoPreviewable",
      url: "https://example.com/video.mp4",
      duration: 1337,
    };
  }

  getDownloadableForGraphql(ready = false, percentageRendered = .25) {
    return {
      __typename: "VideoDownloadable",
      url: "https://example.com/video.mp4",
      duration: 1337,
      ready,
      percentageRendered,
    };
  }

  async getWordsForGraphql(
    startTime?: number | undefined,
    endTime?: number | undefined,
  ) {
    const EXTRA_RANGE_MS = 10_000;
    const transcripts = await this.querySourceInstances(BfMediaNodeTranscript);
    const adjustedStartTime = (startTime ?? this.props.startTime) -
      EXTRA_RANGE_MS;
    const adjustedEndTime = (endTime ?? this.props.endTime) + EXTRA_RANGE_MS;
    const coersedOutput = transcripts[0]?.props.words.map((word) => {
      if (
        word.start >= adjustedStartTime &&
        word.end <= adjustedEndTime
      ) {
        return {
          __typename: "Word",
          text: word.text,
          startTime: word.start,
          endTime: word.end,
          speaker: word.speaker,
        };
      }
    }).filter(Boolean);
    return coersedOutput;
  }

  async downloadClip() {
    // TODO get settings from Org
    const settings = {
      captionLines: 3,
      captionWordsPerLine: 15,
      template: "joe",
      captionColor: "white",
      captionHighlightColor: "rgb(255, 255, 70)",
      font: "BebasNeue",
      fontSize: 96,
      showCaptions: true,
      strokeColor: "rgba(0, 0, 0, 0.75)",
      strokeWidth_px: 6,
      useEndCap: false,
      capCta: "",
      capName: "",
      useTitle: false,
      titleColor: "red",
      titleStrokeColor: "yellow",
      titleStrokeWidth: 12,
      showWatermark: true,
      watermarkLogo: "made_with_bf.png",
      watermarkOpacity: 0.75,
      watermarkPosition: "under_caption",
      watermarkScale: 0.5,
    };
    const media = await this.queryAncestorsByClassName(BfMedia);
    const video = await media[0]?.findVideo(BfMediaNodeVideoRole.PREVIEW);
    const videoFilename = await video.getFilePath();
    if (!videoFilename) {
      throw new BfError("No source file");
    }

    const fileroot = videoFilename?.split(".")[0];
    const transcriptFilename = `${fileroot}.json`;
    const transcriptRaw = await this.getWordsForGraphql(
      this.props.startTime,
      this.props.endTime,
    );
    // convert transcript format to what VCS expects
    // including seconds instead of milliseconds
    const transcript = transcriptRaw.map((word) => (
      {
        word: word?.text ?? "",
        start: (word?.startTime ?? 0) / 1000,
        end: (word?.endTime ?? 0) / 1000,
        punctuated_word: word?.text ?? "",
      }
    ));
    const transcriptForVCS = {
      start_time: this.props.startTime / 1000,
      end_time: this.props.endTime / 1000,
      settings,
      title: this.props.title,
      transcript,
    };
    const fileContent = JSON.stringify(transcriptForVCS, null, 2);
    try {
      await Deno.writeTextFile(transcriptFilename, fileContent);
      logger.info(`Transcript file created at ${transcriptFilename}`);
    } catch (error) {
      logger.error(
        `Failed to create transcript file at ${transcriptFilename}: ${error}`,
      );
      throw new Error(error);
    }

    const renderCode = await render(["-i", videoFilename]);

    const extension = videoFilename.split(".").pop();
    const renderedFilename = videoFilename.replace(
      new RegExp(`\.${extension}$`),
      `_render.${extension}`,
    );

    // Hack for demo
    // Copy file from renderedFilename to {BF_ROOT}/build/downloads
    const title = this.props.title;
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
