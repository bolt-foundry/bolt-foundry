import { BfDsFullPageSpinner, BfDsSpinner } from "../BfDsSpinner.tsx";

/**
 * Example component demonstrating BfDsSpinner usage
 */
export function BfDsSpinnerExample() {
  return (
    <div className="ui-section">
      <div className="bfds-example">
        <h2>BfDsSpinner Examples</h2>

        <div className="bfds-example__section">
          <h3>Basic Spinner</h3>
          <div className="bfds-example__group">
            <BfDsSpinner />
          </div>
        </div>
        <div className="bfds-example__section">
          <h3>Spinner with Wait Icon</h3>
          <div className="bfds-example__group">
            <BfDsSpinner waitIcon />
          </div>
        </div>
        <div className="bfds-example__section">
          <h3>Custom Colors and Offset</h3>
          <div className="bfds-example__group">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <BfDsSpinner
                color="red"
                size={56}
              />
              <BfDsSpinner
                color="orange"
                size={56}
                offset={0.1}
              />
              <BfDsSpinner
                color="yellow"
                size={56}
                offset={0.2}
              />
              <BfDsSpinner
                color="green"
                size={56}
                offset={0.3}
              />
              <BfDsSpinner
                color="blue"
                size={56}
                offset={0.4}
              />
              <BfDsSpinner
                color="indigo"
                size={56}
                offset={0.5}
              />
              <BfDsSpinner
                color="violet"
                size={56}
                offset={0.6}
              />
            </div>
          </div>
        </div>
        <div className="bfds-example__section">
          <h3>Multiple Sizes</h3>
          <div className="bfds-example__group">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <BfDsSpinner size={16} color="var(--bfds-primary)" />
              <BfDsSpinner size={24} color="var(--bfds-primary-08)" />
              <BfDsSpinner size={32} color="var(--bfds-primary-06)" />
              <BfDsSpinner size={48} color="var(--bfds-primary-04)" />
              <BfDsSpinner size={64} color="var(--bfds-primary-02)" />
            </div>
          </div>
        </div>
        <div className="bfds-example__section">
          <h3>Full Page Spinner</h3>
          <div className="bfds-example__group">
            <div
              style={{
                height: "200px",
                width: "100%",
                border: "1px solid var(--bfds-secondary)",
                borderRadius: "4px",
              }}
            >
              <BfDsFullPageSpinner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
