import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import { StarClipButton_clip$key } from "aws/__generated__/StarClipButton_clip.graphql.ts";
import { ButtonSizeType } from "aws/client/ui_components/Button.tsx";

const { useMutation } = ReactRelay;

type Props = {
  clip$key: StarClipButton_clip$key;
  size?: ButtonSizeType;
};

const fragment = await graphql`
  fragment StarClipButton_clip on Clip {
    id
    isStarred
  }
`;

const mutation = await graphql`
  mutation StarClipButtonMutation($id: ID!, $starred: Boolean!) {
    updateClip(id: $id, isStarred: $starred) {
      isStarred
    }
  }
`;

export default function StarClipButton({ clip$key, size }: Props) {
  const [commit, isInFlight] = useMutation(mutation);
  const data = ReactRelay.useFragment(fragment, clip$key);
  const isStarred = data.isStarred ?? false;

  function handleStarClip() {
    commit({
      variables: {
        id: data.id,
        starred: !isStarred,
      },
    });
  }

  return (
    <Button
      kind={isStarred || isInFlight ? "primary" : "secondary"}
      iconLeft={isStarred ? "starSolid" : "star"}
      onClick={handleStarClip}
      showSpinner={isInFlight}
      size={size}
      testId="button-star-clip"
    />
  );
}
