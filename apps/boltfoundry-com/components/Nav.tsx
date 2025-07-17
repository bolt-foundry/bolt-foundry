import { useState } from "react";

import { BfMockBfLogo } from "./mocks/BfMockBfLogo.tsx";
import { BfMockCfDsButton } from "./mocks/BfMockCfDsButton.tsx";

import { useRouter } from "../contexts/RouterContext.tsx";

type Props = {
  page?: string;
};

export function Nav({ page }: Props) {
  const { navigate } = useRouter();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const NavButtons = () => {
    return (
      <>
        <BfMockCfDsButton
          kind={page === "blog" ? "danSelected" : "dan"}
          href="/blog"
          text="Blog"
        />
        <BfMockCfDsButton
          kind={page === "docs" ? "danSelected" : "dan"}
          href="/docs"
          text="Docs"
        />
        <BfMockCfDsButton
          kind="dan"
          href="https://discord.gg/tU5ksTBfEj"
          hrefTarget="_blank"
          rel="noopener noreferrer"
          text="Discord"
        />
      </>
    );
  };

  return (
    <header
      className="landing-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(20, 21, 22, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 0",
      }}
    >
      <div className="landing-content flexRow gapLarge">
        <div className="flex1 flexRow alignItemsCenter">
          <div
            className="header-logo clickable"
            onClick={() => navigate("/")}
            onMouseEnter={() => setHoverLogo(true)}
            onMouseLeave={() => setHoverLogo(false)}
          >
            <BfMockBfLogo
              boltColor={hoverLogo ? "var(--primaryColor)" : "#FFD700"}
              foundryColor={hoverLogo ? "var(--primaryColor)" : "var(--text)"}
              height={32}
            />
          </div>
        </div>
        <div className="mobile-hide">
          <nav className="alignItemsCenter flexRow gapLarge header-nav">
            <NavButtons />
          </nav>
        </div>
        <nav className="mobile-show">
          <BfMockCfDsButton
            kind="dan"
            iconLeft="menu"
            onClick={() => {
              setShowMenu(true);
            }}
          />
        </nav>
        {showMenu && (
          <div className="mobile-show">
            <div className="flexColumn gapLarge sidebar-nav">
              <div className="selfAlignEnd">
                <BfMockCfDsButton
                  kind="dan"
                  iconLeft="cross"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                />
              </div>
              <NavButtons />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
