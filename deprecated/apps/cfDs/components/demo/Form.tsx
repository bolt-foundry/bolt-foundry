import { Example as ExampleDropdown } from "@bfmono/apps/cfDs/components/CfDsDropdownSelector.tsx";
import { Example as ExampleInput } from "@bfmono/apps/cfDs/components/CfDsInput.tsx";
import { Example as ExampleToggle } from "@bfmono/apps/cfDs/components/CfDsToggle.tsx";
import { Example as ExampleCheckbox } from "@bfmono/apps/cfDs/components/CfDsCheckbox.tsx";
import { Example as ExampleRange } from "@bfmono/apps/cfDs/components/CfDsRange.tsx";
import { Example as ExampleForm } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import { Example as ExampleTag } from "@bfmono/apps/cfDs/components/CfDsTagInput.tsx";

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
        <h2>Range Sliders</h2>
        <ExampleRange />
      </div>
      <div className="ui-section">
        <h2>Form</h2>
        <ExampleForm />
      </div>
    </div>
  );
}
