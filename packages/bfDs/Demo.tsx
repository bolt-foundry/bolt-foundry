import * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { ButtonGroup } from "packages/bfDs/ButtonGroup.tsx";
import { BfDsIconDemo } from "packages/bfDs/BfDsIcon.tsx";
import TVStatic from "packages/client/images/TVStatic.tsx";
import { BfDsSpinner } from "packages/bfDs/BfDsSpinner.tsx";
// import WorkflowStatusIndicator from "packages/client/components/WorkflowStatusIndicator.tsx";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { fonts } from "packages/bfDs/const.tsx";
import { useBfDs } from "packages/bfDs/hooks/useBfDs.tsx";
import { ContactUs } from "packages/client/components/ContactUs.tsx";
import { BfDsCallout } from "packages/bfDs/BfDsCallout.tsx";
import { Demo as ToggleDemo } from "packages/bfDs/BfDsToggle.tsx";

const buttonElements = [
  {
    name: "Button (primary/large)",
    component: <BfDsButton text="Primary" kind="primary" size="large" />,
  },
  {
    name: "Button (secondary/medium)",
    component: <BfDsButton text="Secondary" kind="secondary" size="medium" />,
  },
  {
    name: "Button (accent/small)",
    component: <BfDsButton text="Accent" kind="accent" size="small" />,
  },
  {
    name: "Button (outline)",
    component: <BfDsButton text="Outline" kind="outline" />,
  },
  {
    name: "Button (overlay)",
    component: <BfDsButton text="Overlay" kind="overlay" />,
  },
  {
    name: "Button (alert)",
    component: <BfDsButton text="Alert" kind="alert" />,
  },
  {
    name: "Button (success)",
    component: <BfDsButton text="Success" kind="success" />,
  },
  {
    name: "Button (success + spinner)",
    component: <BfDsButton text="Success" kind="success" showSpinner={true} />,
  },
  {
    name: "Button (primary + spinner)",
    component: (
      <BfDsButton text="Primary" iconLeft="pencil" showSpinner={true} />
    ),
  },
];
const buttonElementsWithIcons = [
  {
    name: "Button (icon + text)",
    component: <BfDsButton text="Text" iconLeft="pencil" />,
  },
  {
    name: "Button (icon + text + icon/large)",
    component: (
      <BfDsButton
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
      <BfDsButton
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
      <BfDsButton
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
  {
    name: "Button (icon)",
    component: <BfDsButton iconLeft="plus" size="large" />,
  },
  {
    name: "Button (icon)",
    component: <BfDsButton iconLeft="pencil" kind="secondary" size="medium" />,
  },
  {
    name: "Button (icon/alert)",
    component: <BfDsButton iconLeft="cross" kind="alert" size="small" />,
  },
  {
    name: "Button (icon/success)",
    component: <BfDsButton iconLeft="check" kind="success" />,
  },
  {
    name: "Button (icon/outline)",
    component: <BfDsButton iconLeft="settings" kind="outline" />,
  },
  {
    name: "Button (icon/overlay)",
    component: <BfDsButton iconLeft="download" kind="overlay" />,
  },
  {
    name: "Button (icon/spinner)",
    component: <BfDsButton iconLeft="check" kind="success" showSpinner />,
  },
  {
    name: "Button (icon/spinner/accent)",
    component: <BfDsButton iconLeft="download" kind="accent" showSpinner />,
  },
];
const buttonMenuElements = [
  {
    name: "Icon Button Dropdown menu",
    component: (
      <BfDsButton
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
      <BfDsButton
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
      <BfDsButton
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
      <BfDsButton
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
      <BfDsButton
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
      <BfDsButton
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
          <BfDsButton text="Button" kind="secondary" />,
          <BfDsButton text="Button" />,
        ]}
      />
    ),
  },
];
const darkElements = [
  {
    name: "Button (overlayDark)",
    component: <BfDsButton text="Overlay Dark" kind="overlayDark" />,
  },
  {
    name: "Link",
    component: <BfDsButton text="Link" kind="overlayDark" link="/" />,
  },
  {
    name: "Href",
    component: (
      <BfDsButton text="Href" kind="overlayDark" href="https://facebook.com" />
    ),
  },
  {
    name: "Icon (overlayDark)",
    component: (
      <BfDsButton
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

export function Demo() {
  const { showModal, showToast } = useBfDs();
  const [percent, setPercent] = React.useState<string>("65");
  const [toastIncrement, setToastIncrement] = React.useState<number>(0);

  return (
    <div className="main" style={styles.main}>
      <div className="element" style={styles.element}>
        <div className="name" style={styles.name}>Toasts</div>
        <div className="group" style={styles.group}>
          {/* Plain toast */}
          <BfDsButton text="Toast 1" onClick={() => showToast("Toasty")} />
          {/* Self closing toast */}
          <BfDsButton
            text="Toast 2"
            subtext="Self closing"
            onClick={() => showToast("Toasty 2", { timeout: 4000 })}
          />
          {/* TODO Toast with clickable progress */}
          <BfDsButton
            text="Toast 3"
            subtext="Click x20"
            onClick={() => {
              setToastIncrement(toastIncrement + 20);
              showToast(`Toasty 3 - ${toastIncrement}%`, {
                id: "george",
                shouldShow: toastIncrement < 100,
                closeCallback: () => {
                  setToastIncrement(0);
                },
              });
            }}
          />
        </div>
      </div>

      <div className="element" style={styles.element}>
        <div className="name" style={styles.name}>Modals</div>
        <div className="group" style={styles.group}>
          <BfDsButton
            text="Modal 'hi'"
            onClick={() => showModal(<div>hi</div>)}
          />
          <BfDsButton text="Modal" onClick={() => showModal(<ContactUs />)} />
        </div>
      </div>

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
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            onChange={() => {}}
          />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            type="number"
            onChange={() => {}}
          />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            type="password"
            onChange={() => {}}
          />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            disabled
            onChange={() => {}}
          />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            required
            onChange={() => {}}
          />
          <BfDsInput label="Label" placeholder="Placeholder" readonly />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            meta="Meta"
            onChange={() => {}}
          />
          <BfDsInput
            label="Label"
            placeholder="Placeholder"
            showSpinner
            onChange={() => {}}
          />
        </div>
        <BfDsToggleDemo />
      </div>
      <div className="element" style={styles.element}>
        <div style={styles.name}>Icons</div>
        <div className="group" style={styles.group}>
          <BfDsIconDemo />
        </div>
      </div>
      <div style={styles.element}>
        <div style={styles.name}>Tooltips</div>
        <div style={styles.group}>
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right start"
            tooltipPosition="right"
            tooltipJustification="start"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right center"
            tooltipPosition="right"
            tooltipJustification="center"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="right end"
            tooltipPosition="right"
            tooltipJustification="end"
          />

          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top start"
            tooltipPosition="top"
            tooltipJustification="start"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top center"
            tooltipPosition="top"
            tooltipJustification="center"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="top end"
            tooltipPosition="top"
            tooltipJustification="end"
          />

          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left start"
            tooltipPosition="left"
            tooltipJustification="start"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left center"
            tooltipPosition="left"
            tooltipJustification="center"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="left end"
            tooltipPosition="left"
            tooltipJustification="end"
          />

          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom start"
            tooltipPosition="bottom"
            tooltipJustification="start"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom center"
            tooltipPosition="bottom"
            tooltipJustification="center"
          />
          <BfDsButton
            iconLeft="brand-discord"
            kind="overlayDark"
            tooltip="bottom end"
            tooltipPosition="bottom"
            tooltipJustification="end"
          />
        </div>
      </div>
      <div style={styles.element}>
        <div style={styles.name}>Callouts</div>
        <div style={styles.group}>
          <BfDsCallout kind="info" header="Info" body="Info callout" />
          <BfDsCallout kind="warning" header="Warning" body="Warning callout" />
          <BfDsCallout kind="error" header="Error" body="Error callout" />
          <BfDsCallout kind="success" header="Success" body="Success callout" />
        </div>
      </div>
      <div style={styles.element}>
        <div style={styles.name}>Random</div>
        <div style={styles.group}>
          <BfDsSpinner waitIcon={true} />
          {/* <WorkflowStatusIndicator percent={Number(percent)} /> */}
          <div>
            <BfDsButton
              text="Progress button"
              kind="primary"
              progress={Number(percent)}
            />
            <BfDsButton
              iconLeft="download"
              kind="primary"
              progress={Number(percent)}
            />
          </div>
          <BfDsInput
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
