import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { Input } from "packages/bfDs/Input.tsx";

const { useLazyLoadQuery, useMutation } = ReactRelay;

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
  const [aiResponse, setAiResponse] = React.useState("");
  const [aiModel, setAiModel] = React.useState("gpt-4o-mini");
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAiResponse("");
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

  return (
    <div
      style={{ padding: "20px" }}
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
      <div style={mainDivStyle}>
        <p style={mainChildStyle}>{aiResponse}</p>
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
