/// <reference types="https://esm.sh/v135/@types/dom-webcodecs@0.1.8/index.d.ts" />
import { React } from "aws/client/deps.ts";
import MP4Box from "https://esm.sh/mp4box@0.5.2";
import PageFrame from "aws/client/components/PageFrame.tsx";

const { useState, useEffect, useRef } = React;

type Sample = {
  data: Uint8Array;
  dts: number;
  number: number;
};

type Track = {
  audio: {
    sample_size: number;
    sample_rate: number;
    channel_count: number;
  };
  codec: string;
  id: number;
  nb_samples: number;
  type: string;
};

async function extractAudioFromVideo(
  file: File,
  setAudioFileObjectURL: (url: string) => void,
) {
  // Convert File into ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // @ts-expect-error #techdebt
  arrayBuffer.fileStart = 0;

  const mp4boxfile = MP4Box.createFile();

  // Create an AudioContext and a GainNode for audio processing
  // @ts-expect-error #techdebt
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1;

  // Connect the GainNode to the audio destination (the speakers)
  gainNode.connect(audioContext.destination);

  // Resume audio context on user interaction
  document.addEventListener("click", () => audioContext.resume(), {
    once: true,
  });

  // Create a buffer with 1 channels (mono), each containing 44100 * 6000 samples
  const audioBuffer = audioContext.createBuffer(1, 44100 * 6000, 44100);

  // Create an AudioBufferSourceNode and connect it to the GainNode
  const audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  audioBufferSource.connect(gainNode);

  // Initialize variables for audio decoding
  let byteLength = 0;
  const audioFrames = [] as Array<Int16Array>;

  // Create an AudioDecoder instance to decode audio data
  const audioDecoder = new AudioDecoder({
    output: (audioData) => {
      // Decode audio data into left and right channels
      const leftOutput = new Float32Array(audioData.numberOfFrames);
      const rightOutput = new Float32Array(audioData.numberOfFrames);

      audioData.copyTo(leftOutput, { planeIndex: 0 });
      audioData.copyTo(rightOutput, { planeIndex: 1 });

      // Convert from 32 bit float stereo to 16 bit int mono
      const monoOutputInt = new Int16Array(audioData.numberOfFrames);
      const maxSampleValue = 32767; // maximum value of a 16-bit signed integer
      for (let i = 0; i < audioData.numberOfFrames; i++) {
        const leftSampleFrame = leftOutput[i] * maxSampleValue;
        const rightSampleFrame = rightOutput[i] * maxSampleValue;
        const avgSampleFrame = (leftSampleFrame + rightSampleFrame) / 2;
        monoOutputInt[i] = avgSampleFrame < 0
          ? Math.max(avgSampleFrame, -maxSampleValue)
          : Math.min(avgSampleFrame, maxSampleValue);
      }

      // Push the mono audio data to the array of audio frames
      audioFrames.push(monoOutputInt);

      // Update the total byte length
      byteLength += leftOutput.byteLength / 2; // Divide by 2 to account for converting from 32 to 16 bit
    },
    // deno-lint-ignore no-console
    error: (e) => console.log("error", e),
  });

  // Specify what to do when the MP4 file is ready for processing
  mp4boxfile.onReady = (info: { tracks: Track[] }) => {
    // Find the id of the first audio track
    const track = info.tracks.find((track: Track) => track.type === "audio");
    const audioTrackId = track?.id;
    const audio = track?.audio;

    // set the extraction options for the audio track with audioTrackId
    // to extract all samples and use the properties of track for the extraction
    mp4boxfile.setExtractionOptions(audioTrackId, {
      nb_samples: track?.nb_samples, // extract all samples
      track,
    });

    // Configure the AudioDecoder with the track's codec, sample rate, and number of channels
    audioDecoder.configure({
      codec: track?.codec || "mp4a.40.2",
      sampleRate: audio?.sample_rate || 44100,
      numberOfChannels: audio?.channel_count || 2,
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
    const { audio } = track;

    // For each sample, decode the audio data
    for (const sample of samples) {
      ingestSample(sample);
      if (sample.number === nb_samples - 1) { // if this is the last sample
        await audioDecoder.flush();
        // Create an Int16Array to hold the output audio data. The byteLength property
        // gives the length of the buffer in bytes, not the number of elements, so divide
        // by 2 to get the number of elements (or samples) because each element in an
        // Int16Array is 2 bytes (16 bits) long.
        const outputFileBuffer = new Int16Array(byteLength / 2); // divide by 2 to get the number of elements
        let offset = 0;

        // Copy each audio frame into the output buffer
        for (const audioFrame of audioFrames) {
          outputFileBuffer.set(audioFrame, offset);
          // Update the offset for the next audio frame. Divide by 2 to get the number of samples.
          offset += audioFrame.byteLength / 2;
        }

        // Set up some parameters for the WAV file header
        const bitsPerSample = audio.sample_size;
        const numberOfChannels = 1;
        const sampleRate = audio.sample_rate;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numberOfChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        // Calculate the size of the data chunk in the WAV file. Divide by 2 to get the number of samples.
        const dataSize = outputFileBuffer.byteLength / 2 * blockAlign;

        // Create the various parts of the WAV file header
        const bitsPerSampleBytes = new Uint16Array([bitsPerSample]);
        const numberOfChannelsBytes = new Uint16Array([numberOfChannels]);
        const chunkSize = new Uint32Array([dataSize + 36]);
        const sampleRateBytes = new Uint32Array([sampleRate]);
        const byteRateBytes = new Uint32Array([byteRate]);
        const blockAlignBytes = new Uint16Array([blockAlign]);
        const dataSizeBytes = new Uint32Array([dataSize]);

        // Create a buffer for the WAV file header (44 bytes long)
        const wavHeader = new Uint8Array(44);

        // Set the WAV file header with the appropriate values
        wavHeader.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF" in ASCII
        wavHeader.set(new Uint8Array(chunkSize.buffer), 4); // ChunkSize (36 + SubChunk2Size)
        wavHeader.set([0x57, 0x41, 0x56, 0x45], 8); // "WAVE" in ASCII
        wavHeader.set([0x66, 0x6d, 0x74, 0x20], 12); // "fmt " in ASCII
        wavHeader.set([0x10, 0x00, 0x00, 0x00], 16); // Subchunk1Size (16 for PCM)
        wavHeader.set([0x01, 0x00], 20); // AudioFormat (1 for PCM)
        wavHeader.set(new Uint8Array(numberOfChannelsBytes.buffer), 22); // NumChannels (1 for mono or 2 for stereo)
        wavHeader.set(new Uint8Array(sampleRateBytes.buffer), 24); // SampleRate
        wavHeader.set(new Uint8Array(byteRateBytes.buffer), 28); // ByteRate
        wavHeader.set(new Uint8Array(blockAlignBytes.buffer), 32); // BlockAlign (NumChannels * 2)
        wavHeader.set(new Uint8Array(bitsPerSampleBytes.buffer), 34); // BitsPerSample (audio.sample_size)
        wavHeader.set([0x64, 0x61, 0x74, 0x61], 36); // "data" in ASCII
        wavHeader.set(new Uint8Array(dataSizeBytes.buffer), 40); // Update SubChunk2Size

        // Create a buffer for the WAV file header and the output audio data
        const wavFile = new Uint8Array(
          wavHeader.byteLength + outputFileBuffer.byteLength,
        );

        // Copy the WAV file header and the output audio data into the buffer
        wavFile.set(wavHeader, 0);
        wavFile.set(
          new Uint8Array(outputFileBuffer.buffer),
          wavHeader.byteLength,
        );

        // Create a Blob from the WAV file buffer
        const blob = new Blob([wavFile], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioFileObjectURL(url);
      }
    }
  };

  function ingestSample(sample: Sample) {
    const encodedAudioChunk = new EncodedAudioChunk({
      data: sample.data,
      timestamp: sample.dts,
      type: "key",
    });
    audioDecoder.decode(encodedAudioChunk);
  }

  // @ts-expect-error #techdebt
  mp4boxfile.onError = (e) => {
    // deno-lint-ignore no-console
    console.log("mp4box error", e);
  };

  mp4boxfile.appendBuffer(arrayBuffer);
  mp4boxfile.flush();
}

function LocalMedia() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileObjectURL, setSelectedFileObjectURL] = useState<
    string | null
  >(null);
  const [audioFileObjectURL, setAudioFileObjectURL] = useState<
    string | null
  >(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setSelectedFileObjectURL(fileUrl);
      extractAudioFromVideo(selectedFile, setAudioFileObjectURL);
    }
  }, [selectedFile]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0] != null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <canvas id="canvas" ref={canvasRef} />
      {audioFileObjectURL && <audio controls src={audioFileObjectURL} />}
      {/* {selectedFileObjectURL && <video src={selectedFileObjectURL} controls />} */}
    </div>
  );
}

export default function LocalMediaWithFrame() {
  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <LocalMedia />
    </PageFrame>
  );
}
