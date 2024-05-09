import { React, ReactRelay } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
// import { StarClipButton_clip$key } from "packages/__generated__/StarClipButton_clip.graphql.ts";
import { ButtonSizeType } from "packages/bfDs/Button.tsx";

const { useMutation } = ReactRelay;

type Props = {
  // clip$key: StarClipButton_clip$key;
  size?: ButtonSizeType;
};

// const fragment = await graphql`
//   fragment StarClipButton_clip on Clip {
//     id
//     isStarred
//   }
// `;

// const mutation = await graphql`
//   mutation StarClipButtonMutation($id: ID!, $starred: Boolean!) {
//     updateClip(id: $id, isStarred: $starred) {
//       isStarred
//     }
//   }
// `;

export function StarClipButton({ clip$key, size }: Props) {
  // const [commit, isInFlight] = useMutation(mutation);
  const isInFlight = false;
  // const data = ReactRelay.useFragment(fragment, clip$key);
  const data = {};
  const isStarred = data.isStarred ?? false;

  function handleStarClip() {
    console.log("star clip");
    // commit({
    //   variables: {
    //     id: data.id,
    //     starred: !isStarred,
    //   },
    // });
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
