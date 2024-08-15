import { chunkGoogleFile } from "infra/watcher/ingest.ts";
// import * as Database from "@replit/database";

//example of server request from google:
// POST https://mydomain.com/notifications
// Content-Type: application/json; utf-8
// Content-Length: 0
// X-Goog-Channel-ID: 4ba78bf0-6a47-11e2-bcfd-0800200c9a66
// X-Goog-Channel-Token: 398348u3tu83ut8uu38
// X-Goog-Channel-Expiration: Tue, 19 Nov 2013 01:13:52 GMT
// X-Goog-Resource-ID: ret08u3rv24htgh289g
// X-Goog-Resource-URI: https://www.googleapis.com/drive/v3/files/ret08u3rv24htgh289g
// X-Goog-Resource-State: update
// X-Goog-Changed: content,properties
// X-Goog-Message-Number: 10


const googleProcessQueue: {googleResourceID: string, resourceURI: string }[] = [];

// export const  addToGoogleProcessQueue = (googleJSON) => {
//   googleProcessQueue.push({
//     googleResourceID: googleJSON.X-Goog-Resource-ID,
//     resourceURI: googleJSON.X-Goog-Resource-URI
//   });
// }

export const addToGoogleProcessQueue = (googleJSON) => {
  return;
}


//create a queue or system around the existing queue to process files as they are added. Handler function below:


const googleQueueHandler = async () => {
  while (googleProcessQueue.length > 0) {
    const fileToProcess = {...googleProcessQueue[0]};
    const filename = fileToProcess.resourceURI.split("/").pop();

    const tempDir = await Deno.makeTempDir();
    tmpFile = await Deno.makeTempFile({ dir: TMP_DIR, prefix: "copy_" });
    //probaby needs copy_ in front of it idk
    const tempFilePath = join(tempDir, fileName);

    const response = await fetch(fileToProcess.resourceURI);
    //add error handling

    const fileData = new Uint8Array(await response.arrayBuffer());

    // Write the file data to the temporary file
    await Deno.writeFile(tempFilePath, fileData);

    await chunkGoogleFile(tempFilePath, humanReadable);

    //if all went well...
    const index = googleProcessQueue.findIndex(file => file.googleResourceID === fileToProcess.googleResourceID);
    const queueWithoutItem = googleProcessQueue.filter(file => file.googleResourceID === fileToProcess.googleResourceID);
    //make sure we found an ID and also make sure it's the only ocurance of that ID in the queue. Mostly to ensure queue behaves predictably despite any weird things happening.
    if (index !== -1 && (googleProcessQueue.length === queueWithoutItem.length + 1)) {
      googleProcessQueue.splice(index, 1);
    } else {
      //add error
    }

  }
  // COLBY I LOVE YOU LOL
  // can we talk in ~15 min or so?
  // this is your consciousness, you're not a robot.

}
//note can probably get rid of the queue and just monitor the temporary directory for files. Will have to add error handling to make sure the files get to the temp dir. Either option is susceptible to missing files during server failures until we can periodically check the drive against our database to look for missed items.




//you are now leaving the shit code region.


