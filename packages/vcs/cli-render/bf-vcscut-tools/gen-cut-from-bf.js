import * as fs from 'node:fs';
import { parseArgs } from 'node:util';
import * as Path from 'node:path';

/*
  Takes a Bolt Foundry format transcript.

  Writes a VCSCut file.
*/

// --- inputs ---

const args = parseArgs({
  options: {
    transcript_json: {
      type: 'string',
      short: 't',
    },
    input_video: {
      type: 'string',
      short: 'v',
    },
    output_json: {
      type: 'string',
      short: 'o',
    },
  },
});

const transcriptJsonPath = args.values.transcript_json;
if (!transcriptJsonPath || transcriptJsonPath.length < 1) {
  console.error('transcript input is required');
  process.exit(1);
}
const transcriptObj = JSON.parse(
  fs.readFileSync(transcriptJsonPath, { encoding: 'utf-8' })
);
if (
  !Number.isFinite(transcriptObj.start_time) ||
  !Number.isFinite(transcriptObj.end_time) ||
  transcriptObj.transcript == null
) {
  console.error("transcript object doesn't have expected keys");
  process.exit(1);
}

const inputVideoPath = args.values.input_video;
if (!inputVideoPath) {
  console.error('input video path is required');
  process.exit(1);
}

const outputJsonPath = args.values.output_json;

// --- main ---

const compositionId = 'dev:bf';

const reelId = 'bftest';

const sourceId = 'video1'; // a default id for the single input video

const timelineId = 'tl1'; // a default id for this timeline

const extractStartT = transcriptObj.start_time;
const extractEndT = transcriptObj.end_time;
const extractDuration = extractEndT - extractStartT;
if (extractDuration <= 0) {
  console.error(
    'extract duration is invalid: ',
    extractDuration,
    extractStartT,
    extractEndT
  );
  process.exit(1);
}

// this is the output JSON.
// it could contain multiple sources, clips and cut events, but we don't need that here
const edl = {
  reelId,
  compositionId,
  meta: {
    description: `Generated from Bolt Foundry data`,
  },
  sources: [
    {
      id: sourceId,
      path: Path.resolve(inputVideoPath),
      timelineId,
    },
  ],
  clips: [],
  cut: {
    videoTimeOffset: extractStartT,
    duration: extractDuration,
    events: [],
    audio: [],
  },
};

// write a single clip into the EDL
const clipId = `c_${sourceId}_0`;

edl.clips.push({
  start: extractStartT,
  duration: extractDuration,
  description: '',
  id: clipId,
  source: sourceId,
});

edl.cut.audio.push({
  clips: [clipId],
  duration: extractDuration,
});

// write a single VCS event at the start
let params;
if (compositionId === 'daily:baseline') {
  // for testing, use the default composition to render an overlay
  params = {
    showTextOverlay: true,
    'text.content': getRawWordsForExtract(
      transcriptObj.transcript,
      extractStartT,
      extractEndT
    ),
  };
} else {
  // set params for the BF composition
  params = {
    startTimecode: extractStartT,
    endTimecode: extractEndT,
    transcriptWords: JSON.stringify(transcriptObj.transcript),
  };
}

const cutVideoEv = {
  t: 0,
  clips: [clipId],
  params,
};
edl.cut.events.push(cutVideoEv);

// write out the EDL to file
const outputJson = JSON.stringify(edl, null, 2);

if (outputJsonPath?.length > 0) {
  fs.writeFileSync(outputJsonPath, outputJson, { encoding: 'utf-8' });
} else {
  console.log(outputJson);
}

process.exit(0);

// -- functions --

function getRawWordsForExtract(transcript, startT, endT) {
  let words = [];
  for (let i = 0; i < transcript.length; i++) {
    const { word, start, end } = transcript[i];
    if (start < startT) continue;
    if (start >= endT) break;

    words.push(word);
  }
  return words.join(' ');
}
