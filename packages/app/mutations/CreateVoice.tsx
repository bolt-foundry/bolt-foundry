import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

export const CreateVoiceMutation = iso(`
  field Mutation.CreateVoice($handle: String!) {
    createVoiceAgain(handle: $handle){
      identity {
        EditIdentity
      }
    }
  }
`)(function CreateVoice({ data }) {
  logger.info("createVoiceMutation", data);
  return data;
});
