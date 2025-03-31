import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

enum _SubPages {
  RESEARCH = "research",
}

export const EntrypointTwitterIdeatorWorkshopPermalink = iso(`
  field Query.EntrypointTwitterIdeatorWorkshopPermalink {
  # field Query.EntrypointTwitterIdeatorWorkshopPermalink($researchSlug: String) {
    me {
      asBfCurrentViewerLoggedIn {
        __typename
      }
    }
  }
`)(
  function EntrypointTwitterIdeatorWorkshopPermalink(
    // { data },
  ) {
    // let Body;

    // Body ??= data?.me?.asBfCurrentViewerLoggedIn?.storyBank?.CreateVoice;
    // Body ??= () => null;

    // a future api suggestion:
    // if (Body == null) {
    //   return { redirectToLogin: true };
    // }
    return { Body: () => null, title: "Twitter Workshopping" };
  },
);
