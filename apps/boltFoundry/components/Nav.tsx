import { useState } from "react";

import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";

import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";

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
        <BfDsButton
          kind={page === "blog" ? "danSelected" : "dan"}
          href="/blog"
          text="Blog"
        />
        <BfDsButton
          kind={page === "docs" ? "danSelected" : "dan"}
          href="/docs"
          text="Docs"
        />
        <BfDsButton
          kind="dan"
          href="https://discord.gg/tU5ksTBfEj"
          hrefTarget="_blank"
          rel="noopener noreferrer"
          text="Discord"
        />
        {
          /* <BfDsButton
        kind="outline"
        text="Login"
        link="/login"
        /> */
        }
      </>
    );
  };

  return (
    <header className="landing-header">
      <div className="landing-content flexRow gapLarge">
        <div className="flex1 flexRow alignItemsCenter">
          <div
            className="header-logo clickable"
            onClick={() => navigate("/")}
            onMouseEnter={() => setHoverLogo(true)}
            onMouseLeave={() => setHoverLogo(false)}
          >
            <BfLogo
              boltColor={hoverLogo ? "var(--primaryColor)" : "var(--text)"}
              foundryColor={hoverLogo ? "var(--primaryColor)" : "var(--text)"}
              height={24}
            />
          </div>
        </div>
        <div className="mobile-hide">
          <nav className="alignItemsCenter flexRow gapLarge header-nav">
            <NavButtons />
          </nav>
        </div>
        <nav className="mobile-show">
          <BfDsButton
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
                <BfDsButton
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
