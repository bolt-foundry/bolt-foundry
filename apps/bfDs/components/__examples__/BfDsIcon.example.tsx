import { useState } from "react";
import {
  BfDsIcon,
  type BfDsIconName,
  type BfDsIconSize,
} from "../BfDsIcon.tsx";
import { BfDsButton } from "../BfDsButton.tsx";
import { icons } from "@bfmono/apps/bfDs/lib/icons.ts";

export function BfDsIconExample() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<BfDsIconSize>(
    "medium",
  );

  const iconNames = Object.keys(icons) as Array<BfDsIconName>;
  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bfds-example">
      <h2>BfDsIcon Examples</h2>

      <div className="bfds-example__section">
        <h3>Size Comparison</h3>
        <div className="bfds-example__group bfds-example__group--align-end">
          <div className="bfds-example__item">
            <BfDsIcon name="arrowRight" size="small" />
            <div className="bfds-example__label">Small</div>
          </div>
          <div className="bfds-example__item">
            <BfDsIcon name="arrowRight" size="medium" />
            <div className="bfds-example__label">Medium</div>
          </div>
          <div className="bfds-example__item">
            <BfDsIcon name="arrowRight" size="large" />
            <div className="bfds-example__label">Large</div>
          </div>
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Color Examples</h3>
        <div className="bfds-example__group bfds-example__group--align-center">
          <BfDsIcon name="brand-github" size="large" />
          <BfDsIcon
            name="brand-github"
            size="large"
            color="var(--bfds-primary)"
          />
          <BfDsIcon
            name="brand-github"
            size="large"
            color="var(--bfds-secondary)"
          />
          <BfDsIcon name="brand-github" size="large" color="#ff4444" />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Controls</h3>
        <div className="bfds-example__controls">
          <div className="bfds-example__control">
            <label
              htmlFor="icon-search"
              className="bfds-example__control-label"
            >
              Search Icons:
            </label>
            <input
              id="icon-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              className="bfds-example__input"
            />
          </div>

          <div className="bfds-example__control">
            <label className="bfds-example__control-label">
              Size:
            </label>
            <div className="bfds-example__group">
              {(["small", "medium", "large"] as const).map((size) => (
                <BfDsButton
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? "primary" : "ghost"}
                >
                  {size}
                </BfDsButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>All Icons ({filteredIcons.length} found)</h3>
        <div className="bfds-example__grid">
          {filteredIcons.map((iconName) => (
            <div key={iconName} className="bfds-example__grid-item">
              <BfDsIcon name={iconName} size={selectedSize} />
              <div className="bfds-example__grid-item-label">
                {iconName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
