import { iso } from "@iso-bfc";

export const Home = iso(`
  field Query.Home @component {
    __typename
  }
`)(function Home({ data }) {
  return (
    <div>
      <h1>Bolt Foundry</h1>
      <p>Welcome to Bolt Foundry - powered by Isograph!</p>
      <p>GraphQL type: {data.__typename}</p>
    </div>
  );
});
