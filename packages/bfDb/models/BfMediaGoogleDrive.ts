import { getLogger } from "deps.ts";
import {
  BfMedia,
  BfMediaRequiredProps,
} from "packages/bfDb/coreModels/BfMedia.ts";
// import { BfMediaBffsFile } from "packages/graphql/models/BfMediaBffsFile.ts";
import {
  toBfPid,
  toBfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { rxjs } from "deps.ts";
import type { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { BfMediaBffsFile } from "packages/bfDb/models/BfMediaBffsFile.ts";
import type { ProgressEvent } from "packages/bfDb/classes/BfJobTypes.ts";

const { throttleTime, Subject } = rxjs;
const logger = getLogger(import.meta);
const debugLogger = logger.debug;

type BfMediaGoogleDriveProps = BfMediaRequiredProps & {
  googleFileId: string;
};

export class BfMediaGoogleDrive extends BfMedia<BfMediaGoogleDriveProps> {
  __typename = "BfMediaGoogleDrive" as const;
  ingest() {
    debugLogger(
      "debug",
      "Starting ingestion for googleFileId",
      this.props.googleFileId,
    );
    const ingestionSubject = new Subject<ProgressEvent>();
    (async () => {
      try {
        const bffsFile = await BfMediaBffsFile.create(this.currentViewer, {});
        const bfAssoc = await BfAssocMediaGoogleDriveToMediaBffsFile.create(
          this.currentViewer,
          {
            action: "ingesting",
            googleDriveFileId: this.props.googleFileId,
          },
          {
            bfPid: toBfPid(this.metadata.bfGid),
            bfTid: toBfTid(bffsFile.metadata.bfGid),
          },
        );
      //   ingestionSubject.next({
      //     event: "createdBfModel",
      //     modelName: "BfAssocMediaGoogleDriveToMediaBffsFile",
      //     model: bfAssoc,
      //   });
      //   const ingestionObservable = bfAssoc.ingest();
      //   ingestionObservable.pipe(throttleTime(100, undefined, {
      //     leading: true,
      //     trailing: true,
      //   })).subscribe({
      //     next: ({ ingestionProgress }) => {
      //       ingestionSubject.next({
      //         event: "ingestionProgress",
      //         ingestionProgress,
      //       });
      //     },
      //     error: ingestionSubject.error.bind(ingestionSubject),
      //     complete: ingestionSubject.complete.bind(ingestionSubject),
      //   });
      } catch (error) {
        ingestionSubject.error(error);
      }
    })();
    return ingestionSubject.asObservable();
  }
}
