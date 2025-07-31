import {
  type ButtonType,
  CfDsButton,
} from "@bfmono/apps/cfDs/components/CfDsButton.tsx";

type Props = ButtonType;

export function CfDsFormSubmitButton(
  props: Props,
) {
  return <CfDsButton {...props} type="submit" />;
}
