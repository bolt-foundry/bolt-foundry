import { React } from "deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { Spinner } from "packages/bfDs/Spinner.tsx";

type BaseProps = {
  autoFocus?: boolean;
  autoSelect?: boolean;
  disabled?: boolean;
  label?: string;
  value?: string | number;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
  className?: string;
  meta?: string | React.ReactNode;
  name?: string;
  numberAttributes?: NumberType;
  pattern?: string;
  required?: boolean;
  showSpinner?: boolean;
  testId?: string; // for identifying the element in posthog
  xstyle?: React.CSSProperties;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

type EditableProps = BaseProps & {
  readonly?: false;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

type ReadonlyProps = BaseProps & {
  readonly: true;
  onChange?: never;
};
type InputProps = EditableProps | ReadonlyProps;

type NumberType = {
  min?: number;
  max?: number;
  step?: number;
};

const styles: Record<string, React.CSSProperties> = {
  disabledStyle: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  input: {
    background: "var(--background)",
    boxSizing: "border-box",
    color: "var(--text)",
    fontFamily: fonts.fontFamily,
    fontSize: 16,
    padding: "6px 10px",
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--textSecondary)",
    width: "100%",
  },
  inputContainer: {
    position: "relative",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12,
  },
  meta: {
    color: "var(--textSecondary)",
    marginTop: 4,
  },
  spinner: {
    position: "absolute",
    right: 10,
    top: 10,
  },
};

export function Input(
  {
    autoFocus,
    autoSelect,
    disabled,
    label,
    value,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    type,
    className,
    meta,
    name,
    numberAttributes = {},
    pattern,
    required,
    readonly,
    showSpinner,
    testId,
    xstyle,
  }: InputProps,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoSelect) {
      inputRef.current?.select();
    }
  }, [autoSelect]);

  const input = (
    <input
      disabled={disabled}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      type={type}
      style={{
        ...styles.input,
        ...xstyle,
        ...(disabled && styles.disabledStyle),
      }}
      className={className}
      name={name}
      pattern={pattern}
      required={required}
      readOnly={readonly}
      ref={inputRef}
      data-bf-testid={testId}
      autoFocus={autoFocus}
      {...(type === "number" ? numberAttributes : {})}
    />
  );

  if (label) {
    return (
      <label style={styles.label}>
        {label}
        {required && " *"}
        <div style={styles.inputContainer}>
          {input}
          {showSpinner && (
            <div style={styles.spinner}>
              <Spinner size={16} />
            </div>
          )}
        </div>
        {meta && <div style={styles.meta}>{meta}</div>}
      </label>
    );
  }
  return (
    <div>
      <div style={styles.inputContainer}>
        {input}
        {showSpinner && (
          <div style={styles.spinner}>
            <Spinner size={16} />
          </div>
        )}
      </div>
      {meta && <div style={styles.meta}>{meta}</div>}
    </div>
  );
}
