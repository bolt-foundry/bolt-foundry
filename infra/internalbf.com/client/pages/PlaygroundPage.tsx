import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";

const { useLazyLoadQuery, useMutation } = ReactRelay;

console.log('wat teh')
const testMutation = await graphql`
  mutation PlaygroundPageMutation($input: String!) {
    playgroundMutation(input: $input) {
      success
      message
    }
  }
`;

// const testQuery = await graphql`
//   query PlaygroundPageMutation {
//     currentViewer {
//     person {
//     name
//     }
//     }
//   }
// `;



export function PlaygroundPage() {
  // const data = useLazyLoadQuery(testQuery, {input: "sample"});
  const [commit, isInFlight] = useMutation(testMutation);

  React.useEffect(() => {
    commit({
      variables: {
        input: "sample",
      },
    });
  });
  return (
    <div>
        <div>hi</div>
    </div>
  );
}

// ... on BfCurrentViewerAccessToken {
// }

// const testQuery = await graphql`
// query PlaygroundPageQuery {
// currentViewer {
// __typename

// }
// }
// `;



// const contactUsMutation = await graphql`
//   mutation ContactUsSubmitFormMutation($input: SubmitContactFormInput!) {
//     submitContactForm(input: $input) {
//       success
//       message
//     }
//   }
// `;
