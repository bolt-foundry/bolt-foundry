import { iso } from "@iso-bfc";
import { UIDemo as UIDemo_Traditional } from "../src/components/UIDemo.tsx";

export const UIDemo = iso(`
  field Query.UIDemo @component {
    __typename
  }
`)(function UIDemo() {
  return <UIDemo_Traditional />;
});
