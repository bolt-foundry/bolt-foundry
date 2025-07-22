import { iso } from "@iso-bfc";

export const RlhfHome = iso(`
  field CurrentViewer.RlhfHome @component {
    __typename
  }
`)(function RlhfHomeComponent({ data }) {
  return (
    <div>
      <h1>RLHF Interface</h1>
      <p>Welcome to the RLHF interface! You are logged in.</p>
      <p>❌ No demo conversation found yet</p>
    </div>
  );
});
