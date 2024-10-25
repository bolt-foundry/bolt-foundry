import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "packages/logger/logger.ts";
import type { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfError } from "lib/BfError.ts";
import { BfMediaNodeVideoGoogleDriveResource } from "packages/bfDb/models/BfMediaNodeVideoGoogleDriveResource.ts";
import {
  BfMediaNodeVideo,
  BfMediaNodeVideoRole,
  BfMediaNodeVideoStatus,
} from "packages/bfDb/models/BfMediaNodeVideo.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";

const logger = getLogger(import.meta);

export enum GoogleDriveResourceToMediaEdgeRoles {
  ORIGINAL = "ORIGINAL",
}

export type BfMediaProps = {
  filename: string;
  name: string;
};

export class BfMedia extends BfNode<BfMediaProps> {
  /**
   * @deprecated Use another method to find media related to the current viewer.
   */
  static async findMediaByViewer(bfCurrentViewer: BfCurrentViewer) {
    const media = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return media;
  }

  static async createFromGoogleDriveResource(
    driveResource: BfGoogleDriveResource,
  ) {
    if (!driveResource.isVideo()) {
      throw new BfError(
        `Can't create media from ${driveResource}. Type is ${driveResource.props.mimeType}`,
      );
    }

    const bfMedia = await driveResource.createTargetNode(
      BfMedia,
      { name: driveResource.props.googleDriveMetadata.name },
      GoogleDriveResourceToMediaEdgeRoles.ORIGINAL,
    );
    logger.info(`Created new media ${bfMedia}`);
    await bfMedia.createTargetNode(
      BfMediaNodeVideoGoogleDriveResource,
      { googleDriveResourceId: driveResource.props.resourceId },
    );

    return bfMedia;
    /**
     * Check if google drive resource is a file.
     * If it is, create a new this.
     * Then, create a BfMediaGoogleDriveFile with role: original.
     * Then, if it's a video, do video things to it.
     * If it's not a video, ignore it for now.
     *
     * Video things:
     * 1. generate a transcription (BfMediaNodeTranscript, role: primary) without storing the original audio
     * 2. create a preview quality version (BfMediaVideo, role: preview?)
     * 3. create a render quality version (BfMediaVideo, role: renderable?) and upload it to object storage
     * 4. create a poster frame (BfMediaImage, role: poster?) and upload it to object storage
     * 5. Gather people tracking data (BfMediaPeopleTracking)
     * 6. Gather audio understanding data (BfMediaAudioUnderstanding)
     * 7. Gather thematic data (BfMediaThematicInfo)
     * 8. Gather emotion data (BfMediaEmotion)
     * 9. Gather sentiment data (BfMediaSentiment)
     * 10. Gather language data (BfMediaLanguage)
     * 11. Gather people who appear in the video (BMediaFaceRecognition)
     */
  }

  async findVideo(
    role: BfMediaNodeVideoRole = BfMediaNodeVideoRole.PREVIEW,
  ) {
    const resource = await this.getGoogleDriveResource();

    const video = await resource.queryTargetInstances(
      BfMediaNodeVideo,
      { status: BfMediaNodeVideoStatus.COMPLETED },
      { role },
    );
    return video[0];
  }

  async getVideo(
    role: BfMediaNodeVideoRole = BfMediaNodeVideoRole.PREVIEW,
  ) {
    const resource = await this.getGoogleDriveResource();
    const video = await resource.queryTargetInstances(
      BfMediaNodeVideo,
      {},
      { role },
    );
    return video[0];
  }

  async createTranscripts() {
    const targets = await this.queryTargetInstances(
      BfMediaNodeVideoGoogleDriveResource,
    );
    const transcripts = targets.map(async (target) => {
      return await target.createTranscript();
    });
    return Promise.all(transcripts);
  }

  async getPrimaryTranscript() {
    const resource = await this.getGoogleDriveResource();
    const transcripts = await resource.queryTargetInstances(
      BfMediaNodeTranscript,
    );
    return transcripts[0];
  }

  async getGoogleDriveResource() {
    const targets = await this.queryTargetInstances(
      BfMediaNodeVideoGoogleDriveResource,
    );
    return targets[0];
  }
}
