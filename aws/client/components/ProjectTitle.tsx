import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import { ProjectTitle_project$key } from "aws/__generated__/ProjectTitle_project.graphql.ts";
import Input from "aws/client/ui_components/Input.tsx";
import Button from "aws/client/ui_components/Button.tsx";
const { useFragment, useMutation } = ReactRelay;

type Props = {
  project$key: ProjectTitle_project$key | null;
};

const fragment = await graphql`
  fragment ProjectTitle_project on Project {
    id
    name
  }
`;

const updateProjectMutation = await graphql`
  mutation ProjectTitleMutation($id: ID!, $name: String!) {
    updateProject(id: $id, name: $name) {
      name
    }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  title: {
    color: "var(--text)",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    wordBreak: "break-word",
  },
  form: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
};

const UNTITLED_PROJECT_TEXT = "Untitled";

export default function ProjectTitle({ project$key }: Props) {
  const data = useFragment(fragment, project$key);
  const [commit, isInFlight] = useMutation(updateProjectMutation);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(data?.name || UNTITLED_PROJECT_TEXT);

  React.useEffect(() => {
    setName(data?.name || UNTITLED_PROJECT_TEXT);
    setEditing(false);
  }, [data?.name, project$key]);

  if (!data) return <div style={styles.title}>{UNTITLED_PROJECT_TEXT}</div>;

  function changeName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commit({
      variables: {
        id: data?.id,
        name,
      },
      optimisticResponse: {
        updateProject: {
          id: data?.id,
          name,
        },
      },
      onCompleted: () => {
        setEditing(false);
      },
    });
  }

  return (
    <div>
      {editing
        ? (
          <form onSubmit={changeName} style={styles.form}>
            <div style={{ flex: 1 }}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                xstyle={{ width: "100%" }}
              />
            </div>
            <Button
              onClick={() => setEditing(false)}
              text="Cancel"
              kind="secondary"
            />
            <Button
              type="submit"
              disabled={isInFlight}
              text="Save"
              showSpinner={isInFlight}
            />
          </form>
        )
        : (
          <div style={styles.title}>
            {data.name}
            <Button
              iconLeft="pencil"
              onClick={() => setEditing(true)}
              size="medium"
              kind="overlay"
            />
          </div>
        )}
    </div>
  );
}
