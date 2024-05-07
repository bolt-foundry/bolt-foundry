import { BfMedia } from "packages/bfDb/coreModels/BfMedia.ts";
import { writeAll } from "https://deno.land/std@0.221.0/io/write_all.ts";
import { rxjs } from "deps.ts";
import {
  ProgressEvent,
} from "packages/bfDb/classes/BfJobTypes.ts";
import { dirname } from "infra/build/deps.ts";
import { BfMediaRequiredProps } from "packages/bfDb/coreModels/BfMedia.ts";

const { Subject } = rxjs;

const BFFS_ROOT_PATH = "/tmp/bffs";

export type BfMediaBffsFileRequiredProps = BfMediaRequiredProps & {
  mimeType: string;
};

export class BfMediaBffsFile extends BfMedia<BfMediaBffsFileRequiredProps> {
  __typename = "BfMediaBffsFile" as const;
  get bffsPath() {
    return [
      BFFS_ROOT_PATH,
      this.metadata.bfOid,
      this.metadata.bfPid,
      this.metadata.bfGid,
    ]
      .filter(Boolean)
      .join("/");
  }

  async afterCreate() {
    await Deno.mkdir(dirname(this.bffsPath), { recursive: true });
    await Deno.writeFile(this.bffsPath, new Uint8Array());
  }

  ingest(body: ReadableStream<Uint8Array>, totalLength?: number) {
    const subject = new Subject<ProgressEvent>();
    const path = this.bffsPath;
    const folderPath = dirname(path);
    const fileStream = body;

    const reader = fileStream.getReader();

    (async () => {
      await Deno.mkdir(folderPath, { recursive: true });
      using file = await Deno.open(path, { create: true, write: true });
      const processChunk = async (progress: number): Promise<void> => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            subject.next({ ingestionProgress: 1 });
            subject.complete();
            file.close();
            return;
          }
          const updatedProgress = progress + value.length;
          const ingestionProgress = totalLength
            ? updatedProgress / totalLength
            : 0;
          await writeAll(file, value);
          subject.next({ ingestionProgress });
          await processChunk(updatedProgress);
        } catch (error) {
          subject.error(error);
        }
      };

      await processChunk(0);
    })();

    return subject.asObservable();
  }
}
