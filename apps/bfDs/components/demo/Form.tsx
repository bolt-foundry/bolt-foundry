import { Example as ExampleDropdown } from "apps/bfDs/components/BfDsDropdownSelector.tsx";
import { Example as ExampleInput } from "apps/bfDs/components/BfDsInput.tsx";
import { Example as ExampleToggle } from "apps/bfDs/components/BfDsToggle.tsx";
import { Example as ExampleCheckbox } from "apps/bfDs/components/BfDsCheckbox.tsx";
import { Example as ExampleForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { Example as ExampleTag } from "apps/bfDs/components/BfDsTagInput.tsx";

export function Form() {
  return (
    <div>
      <div className="ui-section">
        <h2>Inputs</h2>
        <ExampleInput />
      </div>
      <div className="ui-section">
        <h2>Dropdown Selector</h2>
        <ExampleDropdown />
      </div>
      <div className="ui-section">
        <h2>Tags</h2>
        <ExampleTag />
      </div>
      <div className="ui-section">
        <h2>Toggles & Checkboxes</h2>
        <ExampleToggle />
        <ExampleCheckbox />
      </div>
      <div className="ui-section">
        <h2>Form</h2>
        <ExampleForm />
      </div>
    </div>
  );
}
