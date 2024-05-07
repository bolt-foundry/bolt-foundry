import { BfGoogleApiToken } from "packages/bfDb/models/BfGoogleApiToken.ts";
import { fetchFile, fetchMetadata } from "lib/googleDrive.ts";
import { getLogger, rxjs } from "deps.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfMediaBffsFile } from "packages/bfDb/models/BfMediaBffsFile.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfJob } from "packages/bfDb/coreModels/BfJob.ts";
import type {
  BfJobOptionalProps,
  BfJobRequiredProps,
  JobStatus,
  JobProgressEvent,
} from "packages/bfDb/coreModels/BfJob.ts";

const logger = getLogger(import.meta);
const logError = logger.error;

const { Subject } = rxjs;

export type BfAssocMediaGoogleDriveToMediaBffsFileRequiredProps =
  & BfJobRequiredProps
  & {
    googleDriveFileId: string;
    status: JobStatus;
  };

export type BfAssocMediaGoogleDriveToMediaBffsFileOptionalProps =
  & BfJobOptionalProps;

export class BfJobIngestMediaGoogleDriveToMediaBffsFile extends BfJob {
  __typename = "BfJobIngestMediaGoogleDriveToMediaBffsFile" as const;

  ingest() {
    const ingestionSubject = new Subject<ProgressEvent>();
    const bffsFilePromise = BfMediaBffsFile.findX(
      this.currentViewer,
      toBfGid(this.metadata.bfTid),
    );
    const personPromise = BfPerson.findX(
      this.currentViewer,
      this.currentViewer.personBfGid,
    );
    (async () => {
      try {
        const person = await personPromise;
        const relatedAssocs = await person.findRelatedAssocs(
          BfGoogleApiToken,
        );

        const firstAssoc = relatedAssocs[0];
        if (!firstAssoc) {
          throw new Error("No associated Google Drive token found");
        }

        const googleApiToken = await BfGoogleApiToken.findX(
          this.currentViewer,
          firstAssoc.metadata.bfGid,
        );
        const token = await googleApiToken.getCurrentAccessToken();
        const metadata = await fetchMetadata(
          token,
          this.props.googleDriveFileId,
        );
        const bffsFile = await bffsFilePromise;
        bffsFile.props.mimeType = metadata.mimeType;
        await bffsFile.save();

        const response = await fetchFile(token, this.props.googleDriveFileId);
        const contentLength = Number(response.headers.get("content-length"));
        const ingestionObservable = bffsFile.ingest(
          response.body!,
          contentLength,
        );

        ingestionObservable.subscribe({
          next: ingestionSubject.next.bind(ingestionSubject),
          error: ingestionSubject.error.bind(ingestionSubject),
          complete: ingestionSubject.complete.bind(ingestionSubject),
        });
      } catch (error) {
        logError("Error during ingestion", error);
        ingestionSubject.error(error);
      }
    })();
    return ingestionSubject.asObservable();
  }
}
