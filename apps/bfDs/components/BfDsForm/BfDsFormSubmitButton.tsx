import {
  BfDsButton,
  type ButtonType,
} from "apps/bfDs/components/BfDsButton.tsx";

type Props = ButtonType;

export function BfDsFormSubmitButton(
  props: Props,
) {
  return <BfDsButton {...props} type="submit" />;
}
