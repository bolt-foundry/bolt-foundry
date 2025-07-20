import { iso } from "@iso-bfc";

export const EntrypointLogin = iso(`
  field Query.EntrypointLogin {
    currentViewer {
      __typename
      asCurrentViewerLoggedIn {
        personBfGid
        orgBfOid
      }
      asCurrentViewerLoggedOut {
        id
      }
    }
    LoginPage
  }
`)(function EntrypointLogin({ data }) {
  const Body = data.LoginPage;
  const title = "Sign in – Bolt Foundry";
  return { Body, title };
});
