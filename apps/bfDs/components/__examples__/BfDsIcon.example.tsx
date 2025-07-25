import { useState } from "react";
import {
  BfDsIcon,
  type BfDsIconName,
  type BfDsIconSize,
} from "../BfDsIcon.tsx";
import { BfDsButton } from "../BfDsButton.tsx";
import { BfDsBadge } from "../BfDsBadge.tsx";
import { icons } from "@bfmono/apps/bfDs/lib/icons.ts";

export function BfDsIconExample() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<BfDsIconSize>(
    "medium",
  );
  const [showGeneratedOnly, setShowGeneratedOnly] = useState(false);

  const iconNames = Object.keys(icons) as Array<keyof typeof icons>;

  // Create a list that includes both original icons and their aliases
  const allIconNames: Array<
    { name: BfDsIconName; isAlias: boolean; aliasOf?: BfDsIconName }
  > = [];

  iconNames.forEach((iconName) => {
    // Add the original icon
    allIconNames.push({ name: iconName, isAlias: false });

    // Add any aliases
    const iconData = icons[iconName];
    if (iconData && "aliases" in iconData && iconData.aliases) {
      iconData.aliases.forEach((alias: string) => {
        allIconNames.push({
          name: alias as BfDsIconName,
          isAlias: true,
          aliasOf: iconName,
        });
      });
    }
  });

  const filteredIcons = allIconNames.filter(({ name, isAlias, aliasOf }) => {
    // Check if name matches search term
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if icon is generated (if filtering by generated only)
    if (showGeneratedOnly) {
      const lookupName = (aliasOf || name) as keyof typeof icons;
      const iconData = icons[lookupName];
      const isGenerated = iconData && "generated" in iconData && iconData.generated;
      return matchesSearch && isGenerated;
    }
    
    return matchesSearch;
  });

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

          <div className="bfds-example__control">
            <label className="bfds-example__control-label">
              Filter:
            </label>
            <div className="bfds-example__group">
              <BfDsButton
                onClick={() => setShowGeneratedOnly(!showGeneratedOnly)}
                variant={showGeneratedOnly ? "primary" : "ghost"}
                icon="sparkle"
              >
                Generated Only
              </BfDsButton>
            </div>
          </div>
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>
          {showGeneratedOnly ? "Generated Icons" : "All Icons"} ({filteredIcons.length} found)
        </h3>
        <div className="bfds-example__grid">
          {filteredIcons.map((iconInfo) => {
            const { name: iconName, isAlias, aliasOf } = iconInfo;
            const lookupName = (aliasOf || iconName) as keyof typeof icons;
            const iconData = icons[lookupName];
            const isGenerated = iconData && "generated" in iconData &&
              iconData.generated;

            return (
              <div
                key={iconName}
                className="bfds-example__grid-item"
                style={{ position: "relative" }}
              >
                {isGenerated && (
                  <BfDsBadge
                    variant="info"
                    size="small"
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: "2px",
                      fontSize: "10px",
                      padding: "2px 4px",
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                  >
                    <BfDsIcon name="sparkle" size="small" />
                  </BfDsBadge>
                )}
                {isAlias && (
                  <BfDsBadge
                    variant="secondary"
                    size="small"
                    style={{
                      position: "absolute",
                      top: isGenerated ? "26px" : "2px",
                      left: "2px",
                      fontSize: "10px",
                      padding: "2px 4px",
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                    title={aliasOf ? `alias of ${aliasOf}` : undefined}
                  >
                    alias
                  </BfDsBadge>
                )}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BfDsIcon name={iconName} size={selectedSize} />
                </div>
                <div className="bfds-example__grid-item-label">
                  {iconName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
