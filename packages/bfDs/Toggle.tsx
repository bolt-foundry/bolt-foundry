import { React } from "deps.ts";

type BaseProps = {
  disabled?: boolean;
  label?: string;
  value: boolean;
  style?: React.CSSProperties;
  className?: string;
  meta?: string | React.ReactNode;
  name?: string;
  required?: boolean;
  testId?: string; // for identifying the element in posthog
};

type EditableProps = BaseProps & {
  readonly?: false;
  onChange: (checked: boolean) => void;
};

type ReadonlyProps = BaseProps & {
  readonly: true;
  onChange?: never;
};

type ToggleProps = EditableProps | ReadonlyProps;

const styles: Record<string, React.CSSProperties> = {
  toggle: {
    position: "relative",
    display: "inline-block",
    width: "60px",
    height: "34px",
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "var(--secondaryButton)",
    borderRadius: "34px",
  },
  sliderDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  switch: {
    position: "absolute",
    width: "26px",
    height: "26px",
    top: "4px",
    transition: "200ms all ease",
    borderRadius: "50%",
    boxShadow: "0 0 2px 0 rgba(10, 10, 10, 0.29)",
  },
  input: {
    opacity: "0",
    width: "0",
    height: "0",
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  meta: {
    color: "var(--textSecondary)",
    marginTop: 4,
  },
};

export function Toggle(
  {
    disabled,
    label,
    value,
    onChange,
    className,
    meta,
    name,
    required,
    readonly,
    testId,
  }: ToggleProps,
) {
  const slider = (
    <span
      style={{
        ...styles.slider,
        backgroundColor: value
          ? "var(--secondaryColor015)"
          : "var(--secondaryButton)",
        ...(disabled && styles.sliderDisabled),
      }}
    >
      <span
        style={{
          ...styles.switch,
          left: value ? "30px" : "4px",
          backgroundColor: value ? "var(--success)" : "var(--textLight)",
        }}
      />
    </span>
  );

  const testIdValue = testId ? `${testId}-${!value}` : undefined;

  const toggle = (
    <label style={styles.toggle} data-bf-testid={testIdValue}>
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={styles.input}
        className={className}
        name={name}
        required={required}
        readOnly={readonly}
      />
      {slider}
    </label>
  );

  if (label) {
    return (
      <label style={styles.label}>
        {label}
        {required && " *"}
        {toggle}
        {meta && <div style={styles.meta}>{meta}</div>}
      </label>
    );
  }
  return (
    <div>
      {toggle}
      {meta && <div style={styles.meta}>{meta}</div>}
    </div>
  );
}
