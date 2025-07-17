import { BfDsFullPageSpinner, BfDsSpinner } from "../BfDsSpinner.tsx";

/**
 * Example component demonstrating BfDsSpinner usage
 */
export function BfDsSpinnerExample() {
  return (
    <div className="ui-section">
      <h2>BfDsSpinner Examples</h2>

      <div className="ui-group">
        <h3>Basic Spinner</h3>
        <BfDsSpinner />
      </div>

      <div className="ui-group">
        <h3>Small Spinner</h3>
        <BfDsSpinner size={24} />
      </div>

      <div className="ui-group">
        <h3>Large Spinner</h3>
        <BfDsSpinner size={64} />
      </div>

      <div className="ui-group">
        <h3>Spinner with Wait Icon</h3>
        <BfDsSpinner waitIcon />
      </div>

      <div className="ui-group">
        <h3>Custom Colors</h3>
        <BfDsSpinner
          color="#ff6b6b"
          size={56}
        />
      </div>

      <div className="ui-group">
        <h3>Multiple Sizes</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <BfDsSpinner size={16} />
          <BfDsSpinner size={24} />
          <BfDsSpinner size={32} />
          <BfDsSpinner size={48} />
          <BfDsSpinner size={64} />
        </div>
      </div>

      <div className="ui-group">
        <h3>Full Page Spinner</h3>
        <div
          style={{
            height: "200px",
            border: "1px solid var(--bfds-secondary)",
            borderRadius: "4px",
          }}
        >
          <BfDsFullPageSpinner />
        </div>
      </div>
    </div>
  );
}
