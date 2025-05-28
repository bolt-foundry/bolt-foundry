import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";

export const Docs = iso(`
  field Query.Docs @component {
    __typename
  }
`)(function Docs(_data, { slug }: { slug: string }) {
  return <div>You're viewing: {slug}</div>;
});
