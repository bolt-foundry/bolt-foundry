import * as React from "react";

export type RangeBaseProps = {
  disabled?: boolean;
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: "small" | "medium" | "large";
  style?: React.CSSProperties;
  className?: string;
  meta?: string | React.ReactNode;
  name?: string;
  required?: boolean;
  testId?: string; // for identifying the element in posthog
} & React.HTMLAttributes<HTMLInputElement>;

type EditableProps = RangeBaseProps & {
  readonly?: false;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type ReadonlyProps = RangeBaseProps & {
  readonly: true;
  onChange?: never;
};

type CfDsRangeProps = EditableProps | ReadonlyProps;

const styles: Record<string, React.CSSProperties> = {
  range: {
    position: "relative",
    display: "inline-block",
    width: "100%",
  },
  rangeNumbers: {
    color: "var(--textSecondary)",
  },
  input: {
    width: "100%",
    appearance: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    opacity: 0,
  },
  track: {
    width: "100%",
    height: "4px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "var(--secondaryButton)",
    borderRadius: "2px",
    pointerEvents: "none",
  },
  progress: {
    height: "100%",
    position: "absolute",
    left: 0,
    backgroundColor: "var(--success)",
    borderRadius: "2px",
    pointerEvents: "none",
  },
  thumb: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "var(--textLight)",
    transition: "background-color 200ms ease",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  thumbActive: {
    backgroundColor: "var(--success)",
  },
  inputDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  label: {
    marginBottom: 12,
    display: "inline-block",
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  meta: {
    color: "var(--textSecondary)",
    marginTop: 4,
    fontSize: "0.8em",
  },
  valueDisplay: {
    minWidth: "40px",
    textAlign: "right",
  },
};

const sizeStyles: Record<string, Record<string, React.CSSProperties>> = {
  small: {
    range: {
      height: 16,
    },
    thumb: {
      width: 10,
      height: 10,
      top: "50%",
    },
    track: {
      height: 3,
    },
  },
  medium: {
    range: {
      height: 24,
    },
    thumb: {
      width: 16,
      height: 16,
      top: "50%",
    },
    track: {
      height: 4,
    },
  },
  large: {
    range: {
      height: 34,
    },
    thumb: {
      width: 26,
      height: 26,
      top: "50%",
    },
    track: {
      height: 6,
    },
  },
};

export function CfDsRange(
  {
    disabled,
    label,
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    className,
    meta,
    name,
    required,
    readonly,
    size = "medium",
    testId,
    ...props
  }: CfDsRangeProps,
) {
  const [isFocused, setIsFocused] = React.useState(false);
  const progressPercent = ((value - min) / (max - min)) * 100;

  const testIdValue = testId ? `${testId}-${value}` : undefined;

  const range = (
    <div
      style={{ ...styles.range, ...sizeStyles[size].range }}
      data-bf-testid={testIdValue}
    >
      <div style={styles.track}>
        <div
          style={{
            ...styles.progress,
            width: `${progressPercent}%`,
          }}
        />
      </div>
      <input
        {...props}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled || readonly}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          ...styles.input,
          ...(disabled && styles.inputDisabled),
        }}
        className={className}
        name={name}
        required={required}
        readOnly={readonly}
      />
      <div
        style={{
          ...styles.thumb,
          ...sizeStyles[size].thumb,
          ...(isFocused && styles.thumbActive),
          left: `${progressPercent}%`,
        }}
      />
    </div>
  );

  if (label) {
    return (
      <label style={styles.label}>
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            {label}: {value}
            {required && " *"}
          </div>
          <div style={styles.rangeNumbers}>
            ({min} - {max})
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {range}
        </div>
        {meta && <div style={styles.meta}>{meta}</div>}
      </label>
    );
  }
  return (
    <label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={styles.valueDisplay}>{value}</div>
        {range}
      </div>
      {meta && <div style={styles.meta}>{meta}</div>}
    </label>
  );
}

export function Example() {
  const [small, setSmall] = React.useState(20);
  const [medium, setMedium] = React.useState(50);
  const [large, setLarge] = React.useState(75);
  const [readOnly, _setReadOnly] = React.useState(30);

  return (
    <div style={{ width: 300 }}>
      <CfDsRange
        size="small"
        label="Small Range"
        value={small}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSmall(parseFloat(e.target.value))}
        meta="This is a small range"
      />
      <CfDsRange
        size="medium"
        label="Medium Range"
        value={medium}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMedium(parseFloat(e.target.value))}
      />
      <CfDsRange
        size="large"
        label="Large Range"
        value={large}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLarge(parseFloat(e.target.value))}
        min={0}
        max={200}
        step={5}
      />
      <CfDsRange
        readonly
        value={readOnly}
        label="Read-only Range"
        meta="This range cannot be modified"
      />
    </div>
  );
}
