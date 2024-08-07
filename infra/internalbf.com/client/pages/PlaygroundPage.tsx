import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { Input } from "packages/bfDs/Input.tsx";
import { Button } from "packages/bfDs/Button.tsx";

const { useLazyLoadQuery, useMutation } = ReactRelay;

const samples = [
  {
    name: "sample1",
    content: await import(
      "infra/aiPlayground/test_database/words/1da49b0955384e7aa51e110dbd25b736_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample2",
    content: await import(
      "infra/aiPlayground/test_database/words/5c57973d4b2a43948a49b6d254906385_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample3",
    content: await import(
      "infra/aiPlayground/test_database/words/50d21ed829774d1fb244bb22684b0ad5_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample4",
    content: await import(
      "infra/aiPlayground/test_database/words/169dd504edff4bd7b4ebae59f0202885_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample5",
    content: await import(
      "infra/aiPlayground/test_database/words/617e231f1c014e2785bf7627eb361c96_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample6",
    content: await import(
      "infra/aiPlayground/test_database/words/17772c835ed14802aaac61bb79c2e5ed_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample7",
    content: await import(
      "infra/aiPlayground/test_database/words/ca44d58db1ae47ba9c47f47ee11c11cf_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample8",
    content: await import(
      "infra/aiPlayground/test_database/words/e9d658eb116f4d898d547ab8b276d9c1_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample9",
    content: await import(
      "infra/aiPlayground/test_database/words/f4c8a47adbe64a32a9216a43ed6e3bfa_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
];
const demoDocuments = samples.map((sample) => {
  const content = JSON.stringify(
    sample.content.default.map((word) => word.word),
  );
  return {
    transcript: content,
    filename: sample.name,
  };
});

const testMutation = await graphql`
  mutation PlaygroundPageMutation($input: String!, $suggestedModel: String) {
    playgroundMutation(input: $input, suggestedModel: $suggestedModel) {
      success
      message
    }
  }
`;

export function PlaygroundPage() {
  const [commit, isInFlight] = useMutation(testMutation);
  const [aiResponse, setAiResponse] = React.useState<string>();
  const [aiModel, setAiModel] = React.useState("gpt-4o-mini");
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAiResponse("[]");
    commit({
      variables: {
        input: prompt,
        suggestedModel: aiModel,
        // suggestedModel: "gpt-4o-mini",
      },
      onCompleted: (response) => {
        setAiResponse(response.playgroundMutation.message);
      },
    });
  };

  const backgroundImage =
    new URL("../resources/playground_background.jpeg", import.meta.url).href;

  let parsedResponse = [];
  if (typeof aiResponse === "string") {
    parsedResponse = JSON.parse(aiResponse);
  } else {
    console.log("NOT A STRING");
  }

  return (
    <div
      style={{ padding: "20px", height: "100vh", overflowY: "auto" }}
    >
      <div
        style={{
          ...mainDivStyle,
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <DropdownSelector
          placeholder="Select AI Model"
          value={aiModel}
          onChange={(value) => setAiModel(value)}
          options={{
            "GPT 3.5 turbo": "gpt-3.5-turbo",
            "GPT 4o mini": "gpt-4o-mini",
            "Claude 3 opus": "claude-3-opus-20240229",
            "Claude 3.5 sonnet": "claude-3-5-sonnet-20240620",
            "Custom": "custom",
          }}
          justification="start"
        />
        {aiModel === "custom" && (
          <input
            type="text"
            style={{ ...mainChildStyle, marginTop: "10px", padding: "10px" }}
            placeholder="Enter custom model"
            onBlur={(e) => setAiModel(e.target.value)}
          />
        )}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Search for clips"
              value={prompt}
              showSpinner={isInFlight}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
          </form>
        </div>
      </div>
      <div
        style={{
          ...mainDivStyle,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "10px",
        }}
      >
        {parsedResponse.map((item, index) => (
          <div
            key={index}
          >
            <h2>{item.title}</h2>
            <p>Description: {item.description}</p>
            <p>Filename: {item.filename}</p>
            <p>Text: {item.text}</p>
            <p>Topics: {item.topics}</p>
            <p>Rational: {item.rationale}</p>
            <p>Confidence: {item.confidence}</p>
          </div>
        ))}
      </div>
      <div className="pageFooter">
        <Button text="Create list" />
      </div>
    </div>
  );
}

const mainDivStyle = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const mainChildStyle = {
  width: "80%",
  marginTop: "20px",
};
