// import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
// import { getLogger } from "packages/logger/logger.ts";

// const _logger = getLogger(import.meta);

// export const LoginPage = iso(`
//   field Query.LoginPage @component {
//     currentViewer {
//       __typename
//       LoginWithGoogleButton
//       asCurrentViewerLoggedIn {
//         __typename
//       }
//     }
//   }
// `)(function LoginPage({ data }) {
//   if (data.currentViewer.asCurrentViewerLoggedIn?.__typename) {
//     return <div>logged in as {data.currentViewer.__typename}</div>;
//   }

//   const LoginWithGoogleButton = data.currentViewer.LoginWithGoogleButton ??
//     (() => null);

//   return <LoginWithGoogleButton />;
// });
