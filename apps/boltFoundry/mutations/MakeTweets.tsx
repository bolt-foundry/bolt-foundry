import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const MakeTweetsMutation = iso(`
  field Mutation.MakeTweets($tweet: String!) {
    makeTweets(tweet: $tweet){
      __typename
    }
  }
`)(function MakeTweets({ data }) {
  logger.info("makeTweetsMutation", data);
  return data;
});
