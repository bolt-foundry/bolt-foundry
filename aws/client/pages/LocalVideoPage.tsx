// deno-lint-ignore-file
// @ts-nocheck
import { React } from "aws/client/deps.ts";
import MP4Box from "https://esm.sh/mp4box@0.5.2";
import { createLogger } from "aws/logs/mod.ts";
const log = createLogger("LocalVideoPage.tsx", "debug");
const { useState, useEffect, useRef } = React;

async function extractVideoFromVideoFile(
  file: File,
  setVideoFrames: (frames: ImageBitmap[]) => void,
) {
  // Convert File into ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  arrayBuffer.fileStart = 0;

  const mp4boxfile = MP4Box.createFile();

  const videoFrames = [] as Array<ImageBitmap>;

  // Create a VideoDecoder instance to decode video data
  const videoDecoder = new VideoDecoder({
    output: (frame) => {
      videoFrames.push(frame.clone().close());
    },
    error: (e) => console.log("error", e),
  });

  // Specify what to do when the MP4 file is ready for processing
  mp4boxfile.onReady = (info: { tracks: Track[] }) => {
    // Find the id of the first video track
    const track = info.tracks.find((track: Track) => track.type === "video");
    const videoTrackId = track?.id;

    // set the extraction options for the video track with videoTrackId
    mp4boxfile.setExtractionOptions(videoTrackId, track);

    // Configure the VideoDecoder with the track's codec
    videoDecoder.configure({
      codec: track?.codec || "avc1.4d0028",
      description: new Uint8Array(track?.codecPrivate.slice(0)), // Add this line
    });

    // Start processing the MP4 file
    mp4boxfile.start();
  };

  // Specify what to do when samples are available from the MP4 file
  mp4boxfile.onSamples = async (
    _id: number,
    { nb_samples, track }: { nb_samples: number; track: Track },
    samples: Array<Sample>,
  ) => {
    // For each sample, decode the video data
    for (const sample of samples) {
      ingestSample(sample);
      if (sample.number === nb_samples - 1) { // if this is the last sample
        await videoDecoder.flush();
        setVideoFrames(videoFrames);
      }
    }
  };

  function ingestSample(sample: Sample) {
    const encodedVideoChunk = new EncodedVideoChunk({
      data: sample.data,
      timestamp: sample.dts,
      type: "key",
    });
    videoDecoder.decode(encodedVideoChunk);
  }

  mp4boxfile.appendBuffer(arrayBuffer);
  mp4boxfile.flush();
}

// export default function LocalVideoMedia() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [videoFrames, setVideoFrames] = useState<ImageBitmap[] | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     if (selectedFile) {
//       extractVideoFromVideoFile(selectedFile, setVideoFrames);
//     }
//   }, [selectedFile]);

//   useEffect(() => {
//     if (videoFrames && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       let frameIndex = 0;
//       const drawFrame = () => {
//         if (frameIndex < videoFrames.length) {
//           ctx?.drawImage(videoFrames[frameIndex], 0, 0);
//           frameIndex++;
//           requestAnimationFrame(drawFrame);
//         }
//       };
//       drawFrame();
//     }
//   }, [videoFrames, canvasRef]);

//   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files?.[0] != null) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <canvas id="canvas" ref={canvasRef} />
//     </div>
//   );
// }

// async function extractFirstFrameFromVideoFile(
//   file: File,
//   setFirstFrame: (frame: ImageBitmap) => void,
// ) {
//   const mp4boxfile = MP4Box.createFile();

//   // Create a VideoDecoder instance to decode video data
//   const videoDecoder = new VideoDecoder({
//     output: (frame) => {
//       // Draw the frame immediately after it's decoded
//       log('Decoded frame', frame);
//       setFirstFrame(frame.clone().close());
//       frame.close();

//       // Close the decoder after the first frame is processed
//       videoDecoder.close();
//     },
//     error: (e) => {
//       log('Error decoding frame', e);
//       console.log("error", e);
//     },
//   });

//   const stream = file.stream();

//   const reader = stream.getReader();

//   // Fetch the file data in chunks.
//   reader.read().then(function process({ done, value }) {
//     if (done) {
//       log('Finished reading file data');
//       mp4boxfile.flush();
//       return;
//     }

//     value.fileStart = 0;
//     mp4boxfile.appendBuffer(value);
//     if (mp4boxfile.isReady()) {
//       log('MP4Box file is ready');

//       // Find the id of the first video track
//       const track = mp4boxfile.getInfo().tracks.find((track) =>
//         track.type === "video"
//       );
//       const videoTrackId = track?.id;

//       // set the extraction options for the video track with videoTrackId
//       mp4boxfile.setExtractionOptions(videoTrackId, track);

//       // Configure the VideoDecoder with the track's codec
//       videoDecoder.configure({
//         codec: track?.codec,
//         description: track?.codecPrivate,
//       });

//       log('VideoDecoder configured', videoDecoder);

//       // Start processing the MP4 file
//       mp4boxfile.start();
//     }

//     return reader.read().then(process);
//   });
// }

function parseAvcCAtom(avcCAtom) {
  return new Promise((resolve, reject) => {
    let dataView = new DataView(avcCAtom);
    let position = 8; // Skip size (4 bytes) and type (4 bytes)

    let configurationVersion = dataView.getUint8(position++);
    let avcProfileIndication = dataView.getUint8(position++);
    let profileCompatibility = dataView.getUint8(position++);
    let avcLevelIndication = dataView.getUint8(position++);
    let lengthSizeMinusOne = dataView.getUint8(position++) & 0x03;

    let numOfSequenceParameterSets = dataView.getUint8(position++) & 0x1F;
    let sequenceParameterSets = [];
    for (let i = 0; i < numOfSequenceParameterSets; i++) {
      let length = dataView.getUint16(position);
      position += 2;
      let sequenceParameterSet = new Uint8Array(
        dataView.buffer.slice(position, position + length),
      );
      sequenceParameterSets.push(sequenceParameterSet);
      position += length;
    }

    let numOfPictureParameterSets = dataView.getUint8(position++);
    let pictureParameterSets = [];
    for (let i = 0; i < numOfPictureParameterSets; i++) {
      let length = dataView.getUint16(position);
      position += 2;
      let pictureParameterSet = new Uint8Array(
        dataView.buffer.slice(position, position + length),
      );
      pictureParameterSets.push(pictureParameterSet);
      position += length;
    }

    return resolve({
      configurationVersion,
      avcProfileIndication,
      profileCompatibility,
      avcLevelIndication,
      lengthSizeMinusOne,
      sequenceParameterSets,
      pictureParameterSets,
    });
  });
}

function getAvcCAtom(moovAtom) {
  return new Promise((resolve, reject) => {
    let position = 0;
    let size, type;
    let decoder = new TextDecoder("utf-8");
    let dataView = new DataView(moovAtom);

    while (position < moovAtom.byteLength) {
      size = dataView.getUint32(position);
      type = decoder.decode(dataView.buffer.slice(position + 4, position + 8));

      if (type === "moov") {
        let moovEnd = position + size;
        position += 8; // Skip past 'moov' atom header

        // Search for 'trak' within 'moov'
        while (position < moovEnd) {
          size = dataView.getUint32(position);
          type = decoder.decode(
            dataView.buffer.slice(position + 4, position + 8),
          );

          if (type === "trak") {
            log("trak atom found");
            // search for 'avcC' within 'trak'
            position += 8; // Skip past 'trak' atom header
            while (position < moovEnd) {
              size = dataView.getUint32(position);
              type = decoder.decode(
                dataView.buffer.slice(position + 4, position + 8),
              );

              if (type === "avcC") {
                log("avcC atom found");
                return resolve(
                  dataView.buffer.slice(position, position + size),
                );
              }
              //   log("avcC atom not found", type, size);
            }
          }
          log("avcC atom not found", type, size);

          position += size; // Move to next atom within 'moov'
        }
      } else {
        position += size; // Move to next top-level atom
      }
    }

    reject(new Error("avcC atom not found"));
  });
}

async function readMoovAtom(file) {
  log("readMoovAtom", file);
  const reader = new FileReader();
  const blob = file.slice(0, file.size);
  const arrayBuffer = await blob.arrayBuffer();
  const dataView = new DataView(arrayBuffer);
  const decoder = new TextDecoder("utf-8");
  return new Promise((resolve, reject) => {
    let position = 0;
    while (position < file.size) {
      const size = dataView.getUint32(position);
      const type = decoder.decode(
        dataView.buffer.slice(position + 4, position + 8),
      ); // decoder is a TextDecoder instance

      if (type === "moov") {
        log("found moov atom");
        const moovAtom = dataView.buffer.slice(position, position + size);
        return resolve(moovAtom); // This is an ArrayBuffer containing the 'moov' atom
      }

      position += size;
    }

    reject(new Error("Moov atom not found in file"));
  });
}

// function findAtoms(dataView: DataView, searchType: string) {
//   return new Promise<Array<DataView>>((resolve, reject) => {
//     let position = 0;
//     let size, type;
//     const matchingAtoms = [];
//     const decoder = new TextDecoder("utf-8");
//     const matchedTypes = new Set();

//     while (position < dataView.byteLength) {
//       size = dataView.getUint32(position);
//       type = decoder.decode(dataView.buffer.slice(position + 4, position + 8));

//       if (type === searchType) {
//         log("findAtoms", searchType, "found");
//         matchingAtoms.push(
//           new DataView(dataView.buffer.slice(position, position + size)),
//         ); // push matching atom into array
//       } else {
//         matchedTypes.add(type);
//       }
//       position += size; // Move to next top-level atom
//     }

//     if (matchingAtoms.length > 0) {
//       resolve(matchingAtoms); // resolve the promise with array of matching atoms
//     } else {
//       log("findAtoms", searchType, "not found", matchedTypes);
//       reject(new Error(`${searchType} atom not found`));
//     }
//   });
// }

function* findAtoms(dataView: DataView, type: string) {
  let position = 0;
  let size, atomType;
  const decoder = new TextDecoder("utf-8");
  const typeMisses = new Set();

  while (position < dataView.byteLength) {
    size = dataView.getUint32(position);
    if (position === 0 && size === dataView.byteLength) {
      // this is the only atom in the file. Get the children of this atom and try to process them instead
      const children = findAtoms(
        new DataView(dataView.buffer.slice(position + 8, position + size)),
        type,
      );
      for (const child of children) {
        yield child;
      }
    } else {
      atomType = decoder.decode(
        dataView.buffer.slice(position + 4, position + 8),
      );

      if (atomType === type) {
        yield new DataView(dataView.buffer.slice(position, position + size));
      } else {
        typeMisses.add(atomType);
      }
    }

    position += size; // Move to next top-level atom
  }
  log("findAtoms", type, "not found", typeMisses);
}

function* findDeepAtoms(dataView: DataView, type: string) {
  let position = 0;
  let size, atomType;
  const decoder = new TextDecoder("utf-8");
  const atomHierarchy = [];

  while (position < dataView.byteLength) {
    size = dataView.getUint32(position);
    if (position === 0 && size === dataView.byteLength) {
      // this is the only atom in the file. Get the children of this atom and try to process them instead
      const children = findAtoms(
        new DataView(dataView.buffer.slice(position + 8, position + size)),
        type,
      );
      for (const child of children) {
        yield child;
      }
    } else {
      atomType = decoder.decode(
        dataView.buffer.slice(position + 4, position + 8),
      );

      atomHierarchy.push(atomType);
      console.log("atomHierarchy", atomHierarchy);
    }

    position += size; // Move to next top-level atom
  }
  log("findAtoms", type, "not found", typeMisses);
}

async function readAtom(file: File, atomType: string) {
  const reader = new FileReader();
  const blob = file.slice(0, file.size);
  const arrayBuffer = await blob.arrayBuffer();
  const dataView = new DataView(arrayBuffer);
  const atoms = [];
  const typeMisses = new Set();

  try {
    for (const atom of findAtoms(dataView, atomType, 0)) {
      atoms.push(atom);
    }
  } catch (error) {
    console.error("Error reading atoms: ", error);
  }

  if (atoms.length === 0) {
    console.log("findAtoms", atomType, "not found", typeMisses);
  }

  return atoms;
}

function findVideoTraks(trakAtoms) {
  const videoTraks = trakAtoms.map((trak) => {
    const [mdia] = findAtoms(trak, "mdia");
    const [hdlr] = findAtoms(mdia, "hdlr");
    const handlerType = hdlr.getUint32(8, false);
    if (handlerType === "vide") {
      return trak;
    }
  }).filter(Boolean);

  // if (videoTraks.length === 0) {
  //   throw new Error("No video trak found");
  // }
  return videoTraks;
}

async function extractFirstFrameFromVideoFile(file: File, setFirstFrame) {
  log("extractFirstFrameFromVideoFile", file);
  const arrayBuffer = await file.arrayBuffer();
  arrayBuffer.fileStart = 0;
  const [moov] = await readAtom(file, "moov");
  log("Moov", moov);
  debugger;
  // Convert generator to array
  const traks = Array.from(findAtoms(moov, "trak"));
  log("found", traks.length, "traks");
  const videoTraks = findVideoTraks(traks);
  log("found", videoTraks.length, "video traks");

  const mp4boxfile = MP4Box.createFile();

  const videoDecoder = new VideoDecoder({
    output: (frame) => {
      log("Decoded frame", frame);
      setFirstFrame(frame.clone().close());
      videoDecoder.close();
    },
    error: (e) => console.log("error", e),
  });

  mp4boxfile.onReady = (info) => {
    log("MP4Box file is ready", info);
    const track = info.tracks.find((track) => track.type === "video");
    log("track", track);
    // debugger;

    if (track) {
      const videoTrackId = track.id;

      mp4boxfile.setExtractionOptions(videoTrackId, {
        nb_samples: 4, // number of samples to extract
        track,
      });

      log(
        "MP4Box extraction options set",
        track,
        track.codecPrivate,
        track.codec,
      );
      videoDecoder.configure({
        codec: track.codec,
        description: track.codecPrivate,
      });

      log("VideoDecoder configured", videoDecoder);

      mp4boxfile.start();
      log("MP4Box file started");
    }
  };

  mp4boxfile.onSamples = (id, info, samples) => {
    for (const sample of samples) {
      const encodedVideoChunk = new EncodedVideoChunk({
        data: sample.data,
        timestamp: sample.dts,
        type: "key",
      });

      videoDecoder.decode(encodedVideoChunk);
    }
  };

  mp4boxfile.appendBuffer(arrayBuffer);
  mp4boxfile.flush();
}
log("hi w");

function LocalMedia() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [firstFrame, setFirstFrame] = useState<VideoFrame | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    log("wat");
    if (selectedFile) {
      log("hi");
      extractFirstFrameFromVideoFile(selectedFile, setFirstFrame);
    }
  }, [selectedFile]);

  // useEffect(() => {
  //   if (firstFrame && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     ctx?.drawImage(firstFrame, 0, 0);
  //   }
  // }, [firstFrame, canvasRef]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    log("foo");
    if (event.target.files?.[0] != null) {
      log("yay");
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {firstFrame && (
        <div>
          {firstFrame.format}
        </div>
      )}
    </div>
  );
}

export default function LocalVideoPageWithFrame() {
  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <LocalMedia />
    </PageFrame>
  );
}
