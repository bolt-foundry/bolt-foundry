#!/usr/bin/env zx
import "zx/globals";

const inputVideoPath = argv._[0];
if (!inputVideoPath) {
  echo`Error: path to media file must be provided as first argument`;
  process.exit(1);
}

const baseDir = path.dirname(inputVideoPath);
const baseFileName = path.basename(
  inputVideoPath,
  path.extname(inputVideoPath)
);

const inputJsonPath = path.resolve(baseDir, baseFileName + ".json");
if (!fs.existsSync(inputJsonPath)) {
  echo`Error: BoltFoundry transcript JSON file expected next to media file (at path: ${inputJsonPath})`;
  process.exit(1);
}

const vcsCutFilePath = path.resolve(
  baseDir,
  baseFileName + "_render.vcscut.json"
);

// -- generate the VCSCut file --
await $`node gen-cut-from-bf.js -t ${inputJsonPath} -v ${inputVideoPath} -o ${vcsCutFilePath}`;

// -- call VCSRender with the cut file --

const w = argv["w"] || 1920;
const h = argv["h"] || 1080;

const BF_PATH = process.env["BF_PATH"] || "../../../..";

const vcsCutTranscriptToolDir = path.resolve(
  BF_PATH,
  "thirdParty/daily-vcs-main/cut-transcript-tools"
);
if (
  !fs.existsSync(vcsCutTranscriptToolDir) ||
  !fs.existsSync(path.resolve(vcsCutTranscriptToolDir, "vcscut-render.zx.mjs"))
) {
  echo`Error: VCS cut-transcript-tools must be at sibling path: ${vcsCutTranscriptToolDir}`;
  process.exit(2);
}

await within(async () => {
  cd(vcsCutTranscriptToolDir);

  await $`npx zx vcscut-render.zx.mjs -i ${vcsCutFilePath} -w ${w} -h ${h}`;
});
