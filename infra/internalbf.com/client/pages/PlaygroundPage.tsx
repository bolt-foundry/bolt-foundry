import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";

const { useLazyLoadQuery, useMutation } = ReactRelay;

const testMutation = await graphql`
  mutation PlaygroundPageMutation($input: String!) {
    playgroundMutation(input: $input) {
      success
      message
    }
  }
`;

export function PlaygroundPage() {
  const [commit, isInFlight] = useMutation(testMutation);

  let [aiResponse, setAiResponse] = React.useState("");

  const handleSubmit = (value) => {
    commit({
      variables: {
        input: value,
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

  
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={mainDivStyle}>
        <textarea 
          onKeyDown={handleKeyDown}
          style={{width: "80%",
                  marginTop: "20px",
                 }} 
          ></textarea>
      </div>
      <div style={mainDivStyle}><p>{aiResponse}</p></div>
    </div>
  );
}


const mainDivStyle = 
  { display: "flex",
    justifyContent: "center",
    width: "100%",
   };