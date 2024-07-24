import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import { ChangeRequestButton_clip$key } from "aws/__generated__/ChangeRequestButton_clip.graphql.ts";
import { ButtonSizeType } from "aws/client/ui_components/Button.tsx";

const { useMutation } = ReactRelay;

type Props = {
  clip$key: ChangeRequestButton_clip$key;
  size?: ButtonSizeType;
};

const fragment = await graphql`
  fragment ChangeRequestButton_clip on Clip {
    id
    changeRequested
  }
`;

const mutation = await graphql`
  mutation ChangeRequestButtonMutation($id: ID!, $changeRequested: Boolean!) {
    updateClip(id: $id, changeRequested: $changeRequested) {
      changeRequested
    }
  }
`;

export default function ChangeRequestButton({ clip$key, size }: Props) {
  const [commit, isInFlight] = useMutation(mutation);
  const data = ReactRelay.useFragment(fragment, clip$key);
  const changeRequested = data.changeRequested ?? false;

  function handleRequestChange() {
    commit({
      variables: {
        id: data.id,
        changeRequested: !changeRequested,
      },
    });
  }

  return (
    <Button
      kind={changeRequested || isInFlight ? "primary" : "secondary"}
      iconLeft={changeRequested ? "commentSolid" : "comment"}
      onClick={handleRequestChange}
      showSpinner={isInFlight}
      size={size}
      testId="button-star-clip"
    />
  );
}
