import { BfDsButton } from "../components/BfDsButton.tsx";
import { BfDsIcon } from "../components/BfDsIcon.tsx";
import { BfDsTabs } from "../components/BfDsTabs.tsx";
import { BfDsForm } from "../components/BfDsForm.tsx";
import { BfDsInput } from "../components/BfDsInput.tsx";
import { BfDsTextArea } from "../components/BfDsTextArea.tsx";
import { BfDsFormSubmitButton } from "../components/BfDsFormSubmitButton.tsx";

export function BfDsDemo() {
  return (
    <div>
      <BfDsButton.Example />
      <BfDsIcon.Example />
      <BfDsTabs.Example />
      <BfDsForm.Example />
      <BfDsInput.Example />
      <BfDsTextArea.Example />
      <BfDsFormSubmitButton.Example />
    </div>
  );
}
