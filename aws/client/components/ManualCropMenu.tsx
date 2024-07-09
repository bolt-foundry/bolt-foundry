import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Input from "aws/client/ui_components/Input.tsx";
import { ManualCropMenu_clip$key } from "aws/__generated__/ManualCropMenu_clip.graphql.ts";
import Button from "aws/client/ui_components/Button.tsx";
import { DGWord } from "aws/types/transcript.ts";

const { useMutation } = ReactRelay;

// TODO put this in lib on replit
export function getCurrentCropIndex(
  manualCrop: Array<ManualCrop>,
  currentTime: number,
  startTimecode?: number,
) {
  // if first crop is in first second, crop the beginning
  if (
    startTimecode &&
    currentTime < manualCrop[0]?.start &&
    manualCrop[0].start < startTimecode + 1
  ) {
    return 0;
  }
  return manualCrop.findLastIndex((crop) => currentTime >= crop.start);
}
export const DEFAULT_CROP = {
  start: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export type ManualCrop = {
  start: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Props = {
  clip$key: ManualCropMenu_clip$key;
  croppingWord: DGWord | null;
  manualCrop: Array<ManualCrop>;
  manualCropActive: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (i: number) => void;
  handleClose: () => void;
};

const fragment = await graphql`
  fragment ManualCropMenu_clip on Clip {
    id
    manualCrop
    manualCropActive
  }
`;

const mutation = await graphql`
  mutation ManualCropMenuMutation(
      $id: ID!, 
      $manualCrop: String!, 
      $manualCropActive: Boolean!
    ) {
    updateClip(
      id: $id, 
      manualCrop: $manualCrop, 
      manualCropActive: $manualCropActive
    ) {
      manualCrop
      manualCropActive
    }
  }
`;

export default function ManualCropMenu(
  {
    clip$key,
    croppingWord,
    manualCrop,
    manualCropActive,
    handleChange,
    handleDelete,
    handleClose,
  }: Props,
) {
  const data = ReactRelay.useFragment(fragment, clip$key);
  const [commit, isInFlight] = useMutation(mutation);
  if (!croppingWord) return;

  const manualCropData = manualCrop ?? JSON.parse(data.manualCrop ?? "[]");
  const manualCropActiveData = manualCropActive ?? data.manualCropActive;
  const currentCropIndex = manualCropData.findIndex((crop) =>
    crop.start >= croppingWord.start && crop.start < croppingWord.end
  );
  const currentCrop = manualCropData[currentCropIndex];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    commit({
      variables: {
        id: data.id,
        manualCrop: JSON.stringify(manualCropData),
        manualCropActive: manualCropActiveData,
      },
    });
    handleClose();
  }

  return (
    <div className="cropMenuModal">
      <form onSubmit={handleSubmit}>
        <div className="flexColumn cropMenuColumn">
          <div className="cropMenuInput">
            <div className="cropMenuLabel">Top</div>
            <Input
              name="top"
              type="number"
              onChange={handleChange}
              value={currentCrop?.top ?? 0}
            />
          </div>
          <div className="flexRow cropMenuMiddleRow">
            <div className="cropMenuInput">
              <div className="cropMenuLabel">Left</div>
              <Input
                name="left"
                type="number"
                onChange={handleChange}
                value={currentCrop?.left ?? 0}
              />
            </div>
            <div className="cropMenuLabel">
              <Button kind="outline" text="Close" onClick={handleClose} />
              <Button type="submit" text="Save crop" showSpinner={isInFlight} />
            </div>
            <div className="cropMenuInput">
              <div className="cropMenuLabel">Right</div>
              <Input
                name="right"
                type="number"
                onChange={handleChange}
                value={currentCrop?.right ?? 0}
              />
            </div>
          </div>
          <div className="cropMenuInput">
            <div className="cropMenuLabel">Bottom</div>
            <Input
              name="bottom"
              type="number"
              onChange={handleChange}
              value={currentCrop?.bottom ?? 0}
            />
          </div>
        </div>
        <Button
          kind="alert"
          onClick={() => {
            handleDelete(currentCropIndex);
            handleClose();
          }}
          text="Delete"
        />
      </form>
    </div>
  );
}
