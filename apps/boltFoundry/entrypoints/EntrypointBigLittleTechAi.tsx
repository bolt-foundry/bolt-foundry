import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointHome = iso(`
  field Query.EntrypointBigLittleTechAi {
  me {
    contentCollection(slug: "bf:///content/marketing") {
      item(id: "bf:///content/biglittletech.ai/page.md") {
        ContentItem
      }
    }
  }
  }
`)(function EntrypointHome({ data }) {
  const Body = data?.me?.contentCollection?.item?.ContentItem;
  const title = "Big Little Tech: Big tech for small teams.";
  return { Body, title };
});
