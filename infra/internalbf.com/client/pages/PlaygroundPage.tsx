import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";

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
  let [aiResponse, setAiResponse] = React.useState("");

  const handleSubmit = async (value: string) => {
    commit({
      variables: {
        input: value,
        suggestedModel: "gpt-3.5-turbo",
      },
      onCompleted: (response) => {
        setAiResponse(response.playgroundMutation.message);
      }
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();// Prevents a new line from being added
      handleSubmit(e.target.value);
      e.target.value = "";
    }
  };

  const backgroundImage = new URL("../resources/playground_background.jpeg", import.meta.url).href;


  return (
    <div style={{ padding: '20px', }}>
      <div
        style={mainDivStyle}>
        <textarea 
          onKeyDown={handleKeyDown}
          style={mainChildStyle} 
          ></textarea>
      </div>
      <div style={mainDivStyle}><p style={mainChildStyle}>{aiResponse}</p></div>
    </div>
  );
}


const mainDivStyle = 
  { 
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

const mainChildStyle = 
  {
    width: "80%",
    marginTop: "20px",
  };