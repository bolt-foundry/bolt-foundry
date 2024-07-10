import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { getJupyterCurrentViewer } from "infra/lib/jupyterUtils.ts";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";

const logger = getLogger(import.meta);
export const cv = await getJupyterCurrentViewer();

if (cv == null) {
  throw new Error("lol no");
}
// const person = await BfPerson.find(cv, "google:108810509077746991108");
// await person.load__PRIVACY_UNSAFE();
// https://www.figma.com/board/eh3N4E8cAiaIdcCotS5W8B/model-for-clips?node-id=0-1&t=5c11085QT9XzpKh1-0

const createClipMutation = `
mutation FancyUpsert($originalClipId: String!, $title: String!) {
  upsertClip(originalClipId: $originalClipId, title: $title) {
    ... on BfClip {
      title
    }
  }
}
`;

const currentViewerQuery = `
query CurrentViewerReviewableClips {
  currentViewer {
    clips(reviewable: true) {
      node {
        ... on BfClip  {
          title
        }
      }
    }
  }
}
`

export const q = () => BfClip.query(cv, {bfOid: cv.organizationBfGid});

const mutationParams = {
  "originalClipId": "foooo",
  "title": "Randall kicks it like bruce lee"
}

export const fakeClips = [
  {
    title: "Reflecting on being from Idaho",
    originalClipId: "old1",
  },
  {
    title: "Exploring the mountains of Colorado",
    oldClipId: "old2",
  },
  {
    title: "Learning to surf in California",
    oldClipId: "old3",
  },
  {
    title: "A day in the life of a New Yorker",
    oldClipId: "old4",
  },
  {
    title: "Experiencing the hustle of Tokyo",
    oldClipId: "old5",
  },
  {
    title: "Street food adventures in Thailand",
    oldClipId: "old6",
  },
  {
    title: "Discovering the pyramids of Egypt",
    oldClipId: "old7",
  },
  {
    title: "A culinary journey through Italy",
    oldClipId: "old8",
  },
  {
    title: "Wildlife safari in Kenya",
    oldClipId: "old9",
  },
  {
    title: "Navigating the canals of Venice",
    oldClipId: "old10",
  },
  {
    title: "Finding peace in the Tibetan monasteries",
    oldClipId: "old11",
  },
  {
    title: "Scuba diving in the Great Barrier Reef",
    oldClipId: "old12",
  },
  {
    title: "Exploring the fjords of Norway",
    oldClipId: "old13",
  },
  {
    title: "A Journey into Coding",
    oldClipId: "old14",
  },
  {
    title: "The Beauty of Nature",
    oldClipId: "old15",
  },
  {
    title: "Historic Sites of Europe",
    oldClipId: "old16",
  },
  {
    title: "Adventures in Space",
    oldClipId: "old17",
  },
];
export const fakeClipReviews = [
  {
    id: "review14",
    clipId: "n5o6p7",
    oldClipId: "old14",
  },
  {
    id: "review15",
    clipId: "q8r9s1",
    oldClipId: "old15",
  },
  {
    id: "review16",
    clipId: "t2u3v4",
    oldClipId: "old16",
  },
  {
    id: "review17",
    clipId: "w5x6y7",
    oldClipId: "old17",
  },
  {
    id: "review18",
    clipId: "z8a1b2",
    oldClipId: "old18",
  },
  {
    id: "review19",
    clipId: "c3d4e5",
    oldClipId: "old19",
  },
  {
    id: "review20",
    clipId: "f6g7h8",
    oldClipId: "old20",
  },
  {
    id: "review21",
    clipId: "i9j1k2",
    oldClipId: "old21",
  },
  {
    id: "review22",
    clipId: "l3m4n5",
    oldClipId: "old22",
  },
  {
    id: "review23",
    clipId: "o6p7q8",
    oldClipId: "old23",
  },
  {
    id: "review24",
    clipId: "r9s1t2",
    oldClipId: "old24",
  },
  {
    id: "review25",
    clipId: "u3v4w5",
    oldClipId: "old25",
  },
];
export const fakeReviewComments = [
  {
    id: "review14Comment1",
    reviewId: "review14",
    timecode: 5,
    text: "Fix syntax error",
  },
  {
    id: "review14Comment2",
    reviewId: "review14",
    timecode: 10,
    text: "Update variable names for clarity",
  },
  {
    id: "review14Comment3",
    reviewId: "review14",
    timecode: 15,
    text: "Refactor function to improve performance",
  },
  {
    id: "review14Comment4",
    reviewId: "review14",
    timecode: 20,
    text: "Add error handling for edge cases",
  },
  {
    id: "review14Comment5",
    reviewId: "review14",
    timecode: 25,
    text: "Update documentation for new features",
  },
  {
    id: "review15Comment1",
    reviewId: "review15",
    timecode: 3,
    text: "Improve image resolution",
  },
  {
    id: "review15Comment1",
    reviewId: "review15",
    timecode: 7,
    text: "Increase video brightness",
  },
  {
    id: "review15Comment1",
    reviewId: "review15",
    timecode: 9,
    text: "Correct typo in subtitle",
  },
  {
    id: "review16Comment1",
    reviewId: "review16",
    timecode: 4,
    text: "Correct historical dates",
  },
  {
    id: "review16Comment2",
    reviewId: "review16",
    timecode: 8,
    text: "Verify architectural accuracy",
  },
  {
    id: "review16Comment3",
    reviewId: "review16",
    timecode: 13,
    text: "Adjust lighting levels",
  },
  {
    id: "review16Comment4",
    reviewId: "review16",
    timecode: 21,
    text: "Add background music",
  },
  {
    id: "review17Comment1",
    reviewId: "review17",
    timecode: 12,
    text: "Update scientific data",
  },
  {
    id: "review17Comment2",
    reviewId: "review17",
    timecode: 18,
    text: "Correct trajectory formulas",
  },
  {
    id: "review17Comment3",
    reviewId: "review17",
    timecode: 24,
    text: "Add missing audio commentary",
  },
  {
    id: "review17Comment4",
    reviewId: "review17",
    timecode: 30,
    text: "Adjust color balance",
  },
  {
    id: "review17Comment5",
    reviewId: "review17",
    timecode: 35,
    text: "Update mission timeline",
  },
  {
    id: "review17Comment6",
    reviewId: "review17",
    timecode: 42,
    text: "Improve graphical overlays",
  },
  {
    id: "review17Comment7",
    reviewId: "review17",
    timecode: 50,
    text: "Verify astronaut bios",
  },
  {
    id: "review17Comment8",
    reviewId: "review17",
    timecode: 55,
    text: "Update space station specs",
  },
  {
    id: "review17Comment9",
    reviewId: "review17",
    timecode: 60,
    text: "Enhance star maps accuracy",
  },
  {
    id: "review17Comment10",
    reviewId: "review17",
    timecode: 65,
    text: "Revise orbital data",
  },
  {
    id: "review17Comment11",
    reviewId: "review17",
    timecode: 70,
    text: "Correct planetary distances",
  },
  {
    id: "review17Comment12",
    reviewId: "review17",
    timecode: 75,
    text: "Review spacewalk procedures",
  },
  {
    id: "review24Comment1",
    reviewId: "review24",
    timecode: 2,
    text: "Improve model accuracy",
  },
  {
    id: "review24Comment2",
    reviewId: "review24",
    timecode: 14,
    text: "Optimize data preprocessing",
  },
  {
    id: "review24Comment3",
    reviewId: "review24",
    timecode: 27,
    text: "Refine hyperparameters",
  },
];
export const fakeReviewDecisions = [
  {
    id: "decision14",
    reviewId: "review14",
    decision: "changes",
  },
  {
    id: "decision15",
    reviewId: "review15",
    decision: "changes",
  },
  {
    id: "decision16",
    reviewId: "review16",
    decision: "changes",
  },
  {
    id: "decision17",
    reviewId: "review17",
    decision: "changes",
  },
  {
    id: "decision18",
    reviewId: "review18",
    decision: "approved",
  },
  {
    id: "decision19",
    reviewId: "review19",
    decision: "approved",
  },
  {
    id: "decision20",
    reviewId: "review20",
    decision: "approved",
  },
  {
    id: "decision21",
    reviewId: "review21",
    decision: "approved",
  },
  {
    id: "decision22",
    reviewId: "review22",
    decision: "rejected",
  },
  {
    id: "decision23",
    reviewId: "review23",
    decision: "rejected",
  },
  {
    id: "decision24",
    reviewId: "review24",
    decision: "changes",
  },
  {
    id: "decision25",
    reviewId: "review25",
    decision: "rejected",
  },
];

export async function createClipsFromFakeData() {
  await Promise.all(fakeClips.map(async (clip) => {
    const createdClip = await BfClip.create(cv, clip);
    // logger.info(createdClip);
    // logger.info(`Created clip ${createdClip.metadata.bfGid}`);
  }));
}

/**
 * User lands on internalbf.com
 * Shown a list of reviewable clips (currentViewer -> clips(reviewable: true) -> clip#1 has no review, clip#2 has a rejected review, clip#3 has a completed review. With the filter, only 1+2 appear)
 * query: current organization where review decisions == "accepted" < 1
 * Click on reviewable clip (clip#1)
 * Clips have an edge to comments, and an edge to review decisions
 * review screen loads with ID of clip#1
 * clip has many comments and some review decisions
 * clip has a url to load to play back
 * need a mutation to add a comment to a clip
 * need a mutation to add a decision to a clip
 */

/**
 * bf.com
 * User downloads a clip, which uploads to replit object storage owned by the repl (or maybe wtf in dev)
 * The client uploads a clip using the original clip url.
 * The backend upserts the clip to the database.
 */
