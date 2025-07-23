import * as React from "react";
import { BfDsRange } from "../BfDsRange.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";

export function BfDsRangeExample() {
  const [value, setValue] = React.useState(50);
  const [volumeValue, setVolumeValue] = React.useState(0.7);
  const [temperatureValue, setTemperatureValue] = React.useState(20);
  const [formData, setFormData] = React.useState<
    Record<string, unknown> | null
  >(null);

  const handleFormSubmit = (data: Record<string, unknown>) => {
    setFormData(data);
  };

  return (
    <div className="bfds-example">
      <h2 className="bfds-example__title">BfDsRange Examples</h2>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Basic Range</h3>
        <BfDsRange
          label="Basic Range"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Sizes</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Small"
            size="small"
            value={30}
            onChange={() => {}}
          />
          <BfDsRange
            label="Medium (default)"
            size="medium"
            value={50}
            onChange={() => {}}
          />
          <BfDsRange
            label="Large"
            size="large"
            value={70}
            onChange={() => {}}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">States</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Default State"
            value={25}
            onChange={() => {}}
            helpText="This is a help text"
          />
          <BfDsRange
            label="Error State"
            state="error"
            value={50}
            onChange={() => {}}
            errorMessage="Value must be between 0 and 40"
          />
          <BfDsRange
            label="Success State"
            state="success"
            value={75}
            onChange={() => {}}
            successMessage="Perfect value!"
          />
          <BfDsRange
            label="Disabled State"
            disabled
            value={50}
            onChange={() => {}}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Custom Min/Max/Step</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Volume (0-1)"
            min={0}
            max={1}
            step={0.1}
            value={volumeValue}
            onChange={(e) => setVolumeValue(Number(e.target.value))}
            formatValue={(val) => `${Math.round(val * 100)}%`}
          />
          <BfDsRange
            label="Temperature (°C)"
            min={-10}
            max={40}
            step={1}
            value={temperatureValue}
            onChange={(e) => setTemperatureValue(Number(e.target.value))}
            formatValue={(val) => `${val}°C`}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">
          Negative Ranges (Fill from Zero)
        </h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Balance (-100 to 100)"
            min={-100}
            max={100}
            step={10}
            value={0}
            onChange={() => {}}
            showTicks
            tickLabels={[
              { value: -100, label: "-100" },
              { value: -50, label: "-50" },
              { value: 0, label: "0" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
          />
          <BfDsRange
            label="Adjustment (-50 to 50)"
            min={-50}
            max={50}
            step={5}
            value={-20}
            onChange={() => {}}
            formatValue={(val) => val > 0 ? `+${val}` : `${val}`}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">With Tick Marks</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Auto-generated Ticks"
            showTicks
            value={50}
            onChange={() => {}}
          />
          <BfDsRange
            label="Custom Tick Labels"
            showTicks
            tickLabels={[
              { value: 0, label: "Empty" },
              { value: 25, label: "Low" },
              { value: 50, label: "Medium" },
              { value: 75, label: "High" },
              { value: 100, label: "Full" },
            ]}
            value={50}
            onChange={() => {}}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Value Display Options</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="With Value Display (default)"
            showValue
            value={75}
            onChange={() => {}}
          />
          <BfDsRange
            label="Without Value Display"
            showValue={false}
            value={25}
            onChange={() => {}}
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Custom Colors</h3>
        <div className="bfds-example__items">
          <BfDsRange
            label="Red Range"
            color="#ef4444"
            value={60}
            onChange={() => {}}
          />
          <BfDsRange
            label="Green Range"
            color="#10b981"
            value={40}
            onChange={() => {}}
          />
          <BfDsRange
            label="Purple Range"
            color="#8b5cf6"
            value={80}
            onChange={() => {}}
            showTicks
          />
        </div>
      </section>

      <section className="bfds-example__section">
        <h3 className="bfds-example__subtitle">Form Integration</h3>
        <BfDsForm initialData={{}} onSubmit={handleFormSubmit}>
          <BfDsRange
            name="brightness"
            label="Brightness"
            min={0}
            max={100}
            required
            helpText="Adjust the screen brightness"
          />
          <BfDsRange
            name="contrast"
            label="Contrast"
            min={0}
            max={100}
            formatValue={(val) => `${val}%`}
          />
          <BfDsRange
            name="saturation"
            label="Saturation"
            min={-50}
            max={50}
            step={5}
            showTicks
            tickLabels={[
              { value: -50, label: "-50" },
              { value: 0, label: "Normal" },
              { value: 50, label: "+50" },
            ]}
          />
          <BfDsFormSubmitButton>Apply Settings</BfDsFormSubmitButton>
        </BfDsForm>
        {formData && (
          <BfDsCallout
            variant="info"
            details={JSON.stringify(formData, null, 2)}
          >
            <h3>Form submitted</h3>
            Settings applied successfully
          </BfDsCallout>
        )}
      </section>
    </div>
  );
}
