import { React } from "deps.ts";
import { graphql, ReactRelay } from "infra/internalbf.com/client/deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
const { useMutation } = ReactRelay;

const mutation = await graphql`
  mutation RandallPlaygroundPageMutation($file: File!, $title: String!, $originalClipId: String!) {
    upsertClip(file: $file, title: $title, originalClipId: $originalClipId) {
      title
    }
  }
`;

export function RandallPlaygroundPage() {
  const [commit, inFlight] = useMutation(mutation);
  const [file, setFile] = React.useState<File>();
  const [text, setText] = React.useState<string>("nothing uploaded");
  return <div>Randall Playground<Button text={"fake"} onClick={() => {
    commit({
      variables: {
        file: "foo",
        title: "food",
        originalClipId: "foop",
      },
      uploadables: {
        file,
      },
      onCompleted(response) {
        setText(response.upsertClip.title);
      }
    })
  }} />
    <input type="file" onChange={(e) => setFile((e?.target?.files ?? [])[0])} />
    {text}
  </div>;
}