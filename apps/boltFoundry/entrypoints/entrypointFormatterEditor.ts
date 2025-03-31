import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const entrypointFormatterEditor = iso(`
  field Query.entrypointFormatterEditor {
    me {
      organization {
        FormatterEditor
      }
    }
  }
`)(
  function entrypointFormatterEditor(
    { data },
  ) {
    return {
      Body: data?.me?.organization?.FormatterEditor,
      title: "Formatter Editor",
    };
  },
);
