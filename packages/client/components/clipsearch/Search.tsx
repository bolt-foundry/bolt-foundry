import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { SearchQuery } from "packages/__generated__/SearchQuery.graphql.ts";
const { useState } = React;
const { useLazyLoadQuery } = ReactRelay;

const query = await graphql`
  query SearchQuery {
    transcripts {
      id
      filename
      transcript
    }
  }
`;

export function Search() {
  const data = useLazyLoadQuery<SearchQuery>(query, {});
  const [prompt, setPrompt] = useState("");
  const [isInFlight, setIsInFlight] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Searching for", prompt);
    console.log("Transcripts: ", data.transcripts.length);
    setIsInFlight(true);
    setTimeout(() => setIsInFlight(false), 3000);
    setPrompt("");
  }
  return (
    <div className="cs-search">
      <form onSubmit={onSubmit}>
        <Input
          placeholder="Search"
          showSpinner={isInFlight}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
      </form>
    </div>
  );
}
