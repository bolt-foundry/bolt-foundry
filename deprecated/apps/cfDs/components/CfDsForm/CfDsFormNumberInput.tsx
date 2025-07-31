import {
  type CfDsFormValue,
  useCfDsFormContext,
} from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import {
  CfDsInput,
  type InputBaseProps,
} from "@bfmono/apps/cfDs/components/CfDsInput.tsx";

type Props = { id: string; title: string } & InputBaseProps;

export function CfDsFormNumberInput(
  { id, title, ...props }: Props,
) {
  const { data, onChange } = useCfDsFormContext() as CfDsFormValue;
  if (!data) return null;
  return (
    <CfDsInput
      {...props}
      label={title}
      type="number"
      name={id}
      value={data[id]}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.({ ...data, [id]: e.target.value })}
    />
  );
}
