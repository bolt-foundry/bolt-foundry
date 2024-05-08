import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { ButtonGroup } from "packages/bfDs/ButtonGroup.tsx";
import { IconDemo } from "packages/bfDs/Icon.tsx";
import TVStatic from "packages/client/images/TVStatic.tsx";
import { Spinner } from "packages/bfDs/Spinner.tsx";
import WorkflowStatusIndicator from "packages/client/components/WorkflowStatusIndicator.tsx";
import { Input } from "packages/bfDs/Input.tsx";
import { fonts } from "packages/bfDs/ui_const.tsx";

const buttonElements = [
  {
    name: "Button (primary/large)",
    component: <Button text="Primary" kind="primary" size="large" />,
  },
  {
    name: "Button (secondary/medium)",
    component: <Button text="Secondary" kind="secondary" size="medium" />,
  },
  {
    name: "Button (accent/small)",
    component: <Button text="Accent" kind="accent" size="small" />,
  },
  {
    name: "Button (outline)",
    component: <Button text="Outline" kind="outline" />,
  },
  {
    name: "Button (overlay)",
    component: <Button text="Overlay" kind="overlay" />,
  },
  { name: "Button (alert)", component: <Button text="Alert" kind="alert" /> },
  {
    name: "Button (success)",
    component: <Button text="Success" kind="success" />,
  },
  {
    name: "Button (success + spinner)",
    component: <Button text="Success" kind="success" showSpinner={true} />,
  },
  {
    name: "Button (primary + spinner)",
    component: <Button text="Primary" iconLeft="pencil" showSpinner={true} />,
  },
];
const buttonElementsWithIcons = [
  {
    name: "Button (icon + text)",
    component: <Button text="Text" iconLeft="pencil" />,
  },
  {
    name: "Button (icon + text + icon/large)",
    component: (
      <Button
        text="Text"
        subtext="More text"
        iconLeft="pencil"
        iconRight="cross"
      />
    ),
  },
  {
    name: "Button (icon + text + icon/medium)",
    component: (
      <Button
        text="Text"
        subtext="More text"
        iconLeft="pencil"
        iconRight="cross"
        size="medium"
      />
    ),
  },
  {
    name: "Button (icon + text + icon/small)",
    component: (
      <Button
        text="Text"
        subtext="More text"
        iconLeft="pencil"
        iconRight="cross"
        size="small"
      />
    ),
  },
];
const buttonElementsWithIconsOnly = [
  { name: "Button (icon)", component: <Button iconLeft="plus" size="large" /> },
  {
    name: "Button (icon)",
    component: <Button iconLeft="pencil" kind="secondary" size="medium" />,
  },
  {
    name: "Button (icon/alert)",
    component: <Button iconLeft="cross" kind="alert" size="small" />,
  },
  {
    name: "Button (icon/success)",
    component: <Button iconLeft="check" kind="success" />,
  },
  {
    name: "Button (icon/outline)",
    component: <Button iconLeft="settings" kind="outline" />,
  },
  {
    name: "Button (icon/overlay)",
    component: <Button iconLeft="download" kind="overlay" />,
  },
  {
    name: "Button (icon/spinner)",
    component: <Button iconLeft="check" kind="success" showSpinner />,
  },
  {
    name: "Button (icon/spinner/accent)",
    component: <Button iconLeft="download" kind="accent" showSpinner />,
  },
];
const buttonMenuElements = [
  {
    name: "Icon Button Dropdown menu",
    component: (
      <Button
        iconLeft="settings"
        kind="outline"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
      />
    ),
  },
  {
    name: "Button Dropdown menu",
    component: (
      <Button
        text="Button menu"
        kind="outline"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
      />
    ),
  },
  {
    name: "Icon Button Dropdown menu",
    component: (
      <Button
        iconLeft="settings"
        kind="secondary"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
      />
    ),
  },
  {
    name: "Button Dropdown menu",
    component: (
      <Button
        text="Button menu"
        kind="secondary"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
      />
    ),
  },
  {
    name: "Icon Button Dropdown menu",
    component: (
      <Button
        iconLeft="settings"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
      />
    ),
  },
  {
    name: "Button Dropdown menu",
    component: (
      <Button
        text="Button menu w/ tooltip"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => {} },
          { label: "Menu Item 2", onClick: () => {} },
          { label: "Menu Item 3", onClick: () => {} },
        ]}
        tooltipJustification="end"
        tooltipPosition="bottom"
        tooltip="Tooltip"
      />
    ),
  },
];
const buttonGroupElements = [
  {
    name: "ButtonGroup",
    component: (
      <ButtonGroup
        buttons={[
          <Button text="Button" kind="secondary" />,
          <Button text="Button" />,
        ]}
      />
    ),
  },
];
const darkElements = [
  {
    name: "Button (overlayDark)",
    component: <Button text="Overlay Dark" kind="overlayDark" />,
  },
  {
    name: "Link",
    component: <Button text="Link" kind="overlayDark" link="/" />,
  },
  {
    name: "Href",
    component: (
      <Button text="Href" kind="overlayDark" href="https://facebook.com" />
    ),
  },
  {
    name: "Icon (overlayDark)",
    component: (
      <Button
        iconLeft="brand-tiktok"
        kind="overlayDark"
        href="https://www.tiktok.com"
        hrefTarget="_blank"
      />
    ),
  },
];

const styles: Record<string, React.CSSProperties> = {
  main: {
    fontFamily: fonts.fontFamily,
    color: "var(--text)",
    padding: 20,
    backgroundColor: "var(--pageBackground)",
    overflowY: "auto",
    height: "100vh",
  },
  name: {
    marginBottom: 8,
  },
  element: {
    marginBottom: 20,
    backgroundColor: "var(--background)",
    padding: "16px 20px",
    borderRadius: 6,
  },
  elementDark: {
    background: "var(--marketingBackground)",
    color: "var(--background)",
  },
  group: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  palette: {
    position: "relative",
    width: 180,
    height: 90,
    marginBottom: 20,
  },
  box: {
    position: "absolute",
    width: 90,
    padding: "6px 10px",
    boxSizing: "border-box",
    fontSize: "0.8em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    top: 0,
    left: 0,
    height: 90,
    backgroundColor: "var(--primaryColor)",
    borderRadius: "6px 0 0 6px",
  },
  secondary: {
    top: 0,
    right: 0,
    height: 30,
    backgroundColor: "var(--secondaryColor)",
    borderRadius: "0 6px 0 0",
  },
  tertiary: {
    top: 30,
    right: 0,
    height: 30,
    backgroundColor: "var(--tertiaryColor)",
  },
  fourthary: {
    top: 60,
    right: 0,
    height: 30,
    backgroundColor: "var(--fourtharyColor)",
    borderRadius: "0 0 6px 0",
  },
};

const uiElementGroups = [
  { name: "Buttons", elements: buttonElements },
  { name: "Buttons (with icons)", elements: buttonElementsWithIcons },
  { name: "Buttons (icons only)", elements: buttonElementsWithIconsOnly },
  { name: "Button Menu", elements: buttonMenuElements },
  { name: "ButtonGroup", elements: buttonGroupElements },
  { name: "Dark Elements", elements: darkElements, dark: true },
];

export default function UITest() {
  const [percent, setPercent] = React.useState<string>("65");
  return (
    <div className="main" style={styles.main}>
      <div className="element" style={styles.element}>
        <div style={styles.name}>Color Palette</div>
        <div style={styles.palette}>
          <div style={{ ...styles.box, ...styles.primary }} />
          <div style={{ ...styles.box, ...styles.secondary }} />
          <div style={{ ...styles.box, ...styles.tertiary }} />
          <div style={{ ...styles.box, ...styles.fourthary }} />
        </div>
      </div>
      {uiElementGroups.map((group, index) => (
        <div
          className="element"
          style={{ ...styles.element, ...(group.dark && styles.elementDark) }}
          key={index}
        >
          <div style={styles.name}>{group.name}</div>
          <div className="group" style={styles.group}>
            {group.elements.map((element, i) => (
              <div style={styles.component} key={i}>
                {/* <div style={styles.name}>{element.name}</div> */}
                {element.component}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="element" style={styles.element}>
        <div style={styles.name}>Form</div>
        <div className="group" style={styles.group}>
          <Input label="Label" placeholder="Placeholder" onChange={() => {}} />
          <Input
            label="Label"
            placeholder="Placeholder"
            type="number"
            onChange={() => {}}
          />
          <Input
            label="Label"
            placeholder="Placeholder"
            type="password"
            onChange={() => {}}
          />
          <Input
            label="Label"
            placeholder="Placeholder"
            disabled
            onChange={() => {}}
          />
          <Input
            label="Label"
            placeholder="Placeholder"
            required
            onChange={() => {}}
          />
          <Input label="Label" placeholder="Placeholder" readonly />
          <Input
            label="Label"
            placeholder="Placeholder"
            meta="Meta"
            onChange={() => {}}
          />
          <Input
            label="Label"
            placeholder="Placeholder"
            showSpinner
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="element" style={styles.element}>
        <div style={styles.name}>Icons</div>
        <div className="group" style={styles.group}>
          <IconDemo />
        </div>
      </div>
      <div style={styles.element}>
        <div style={styles.name}>Tooltips</div>
        <div style={styles.group}>
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right start"
            tooltipPosition="right"
            tooltipJustification="start"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right center"
            tooltipPosition="right"
            tooltipJustification="center"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right end"
            tooltipPosition="right"
            tooltipJustification="end"
          />

          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top start"
            tooltipPosition="top"
            tooltipJustification="start"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top center"
            tooltipPosition="top"
            tooltipJustification="center"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top end"
            tooltipPosition="top"
            tooltipJustification="end"
          />

          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left start"
            tooltipPosition="left"
            tooltipJustification="start"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left center"
            tooltipPosition="left"
            tooltipJustification="center"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left end"
            tooltipPosition="left"
            tooltipJustification="end"
          />

          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom start"
            tooltipPosition="bottom"
            tooltipJustification="start"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom center"
            tooltipPosition="bottom"
            tooltipJustification="center"
          />
          <Button
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom end"
            tooltipPosition="bottom"
            tooltipJustification="end"
          />
        </div>
      </div>
      <div style={styles.element}>
        <div style={styles.name}>Random</div>
        <div style={styles.group}>
          <Spinner waitIcon={true} />
          <WorkflowStatusIndicator percent={Number(percent)} />
          <div>
            <Button
              text="Progress button"
              kind="primary"
              progress={Number(percent)}
            />
            <Button
              iconLeft="download"
              kind="primary"
              progress={Number(percent)}
            />
          </div>
          <Input
            label="Percent"
            value={percent}
            type="number"
            onChange={(e) => setPercent(e.target.value)}
            style={{ width: 100 }}
          />
          <div style={{ height: 100, width: 130 }}>
            <TVStatic />
          </div>
        </div>
      </div>
    </div>
  );
}
