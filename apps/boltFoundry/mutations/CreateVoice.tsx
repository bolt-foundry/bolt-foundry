import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const CreateVoiceMutation = iso(`
  field Mutation.CreateVoice($handle: String!) {
    createVoice(handle: $handle){
      identity {
        EditIdentity
      }
    }
  }
`)(function CreateVoice({ data }) {
  logger.info("createVoiceMutation", data);
  return data;
});
