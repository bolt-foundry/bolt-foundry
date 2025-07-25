import { useState } from "react";

import { BfLogo } from "@bfmono/apps/cfDs/static/BfLogo.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

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
          variant={page === "blog" ? "primary" : "ghost-primary"}
          href="/blog"
          target="_top"
        >
          Blog
        </BfDsButton>
        <BfDsButton
          variant={page === "docs" ? "primary" : "ghost-primary"}
          href="/docs"
          target="_top"
        >
          Docs
        </BfDsButton>
        <BfDsButton
          variant="ghost-primary"
          href="https://discord.gg/tU5ksTBfEj"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </BfDsButton>
        {
          /* <BfDsButton
        variant="outline"
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
              boltColor={hoverLogo ? "var(--bfds-primary)" : "var(--bfds-text)"}
              foundryColor={hoverLogo
                ? "var(--bfds-primary)"
                : "var(--bfds-text)"}
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
            variant="ghost"
            icon="menu"
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
                  variant="ghost"
                  icon="cross"
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
