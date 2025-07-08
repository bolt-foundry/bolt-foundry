import { iso } from "@iso";

export const Home = iso(`
  field CurrentViewer.Home @component {
    __typename
    githubRepoStats {
      stars
    }
  }
`)(function HomeComponent({ data }) {
  const stars = data.githubRepoStats?.stars ?? 0;
  
  return (
    <div>
      <h1>Hello World - bolt-foundry/bolt-foundry has {stars} stars</h1>
    </div>
  );
});