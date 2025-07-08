import { iso } from "@iso";

export const QueryHomePage = iso(`
  field Query.HomePage {
    currentViewer {
      Home
    }
  }
`)(function QueryHomePage({ data }) {
  const Component = data.currentViewer.Home;
  return Component;
});