import { useState } from "react";

import { BfLogo } from "@bfmono/apps/cfDs/static/BfLogo.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

import { useRouter } from "@bfmono/apps/boltfoundry-com/contexts/RouterContext.tsx";

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
        {
          /* <BfDsButton
          variant={page === "blog" ? "primary" : "outline"}
          overlay={page !== "blog"}
          href="/blog"
          target="_top"
        >
          Blog
        </BfDsButton>
        <BfDsButton
          variant={page === "docs" ? "primary" : "outline"}
          overlay={page !== "docs"}
          href="/docs"
          target="_top"
        >
          Docs
        </BfDsButton> */
        }
        <BfDsButton
          variant="outline"
          overlay
          href="https://github.com/bolt-foundry/bolt-foundry"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </BfDsButton>
        <BfDsButton
          variant="outline"
          overlay
          href="https://discord.gg/tU5ksTBfEj"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </BfDsButton>
        <BfDsButton
          variant={page === "ui" ? "primary" : "outline"}
          overlay={page !== "ui"}
          onClick={() => navigate("/ui")}
        >
          UI Demo
        </BfDsButton>
        <BfDsButton
          variant="secondary"
          overlay
          onClick={() => navigate("/login")}
        >
          Login
        </BfDsButton>
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
