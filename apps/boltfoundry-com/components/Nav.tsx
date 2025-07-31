import { useState } from "react";

import { BfLogo } from "@bfmono/apps/cfDs/static/BfLogo.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";

type Props = {
  page?: string;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
};

export function Nav({ page, onSidebarToggle, sidebarOpen }: Props) {
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const NavButtons = () => {
    return (
      <>
        <BfDsButton
          variant="outline"
          overlay
          href="https://github.com/bolt-foundry/bolt-foundry"
          target="_blank"
          rel="noopener noreferrer"
          icon="brand-github"
          iconOnly
          size="small"
        />
        <BfDsButton
          variant="outline"
          overlay
          href="https://discord.gg/tU5ksTBfEj"
          target="_blank"
          rel="noopener noreferrer"
          icon="brand-discord"
          iconOnly
          size="small"
        />
        <div className="navSeparator" />
        {page !== "home" && (
          <BfDsButton
            variant="outline"
            link="/"
            overlay
            icon="home"
          />
        )}
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
        </BfDsButton>
        <BfDsButton
          variant={page === "eval" ? "primary" : "outline"}
          overlay={page !== "eval"}
          link="/eval"
        >
          Eval
        </BfDsButton>
        <BfDsButton
          variant={page === "ui" ? "primary" : "outline"}
          overlay={page !== "ui"}
          link="/ui"
        >
          UI Demo
        </BfDsButton> */
        }
        {isLoading
          ? (
            <BfDsButton variant="outline" disabled>
              Loading...
            </BfDsButton>
          )
          : isAuthenticated
          ? (
            <>
              {user && (
                <div className="flexRow alignItemsCenter gapSmall">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "2px solid var(--bfds-border)",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "14px",
                      color: "var(--bfds-text-secondary)",
                    }}
                  >
                    {user.name}
                  </span>
                </div>
              )}
              <BfDsButton
                variant="outline"
                onClick={() => logout()}
              >
                Logout
              </BfDsButton>
            </>
          )
          : (
            <BfDsButton
              variant={page === "login" ? "secondary" : "outline-secondary"}
              link="/login"
            >
              Login
            </BfDsButton>
          )}
      </>
    );
  };

  return (
    <header className="landing-header flexRow">
      <div className="flex1 selfAlignCenter">
        {onSidebarToggle && (
          <div className="landing-header-sidebar-button">
            <BfDsButton
              variant={sidebarOpen ? "primary" : "ghost"}
              icon={sidebarOpen ? "sidebarClose" : "sidebarOpen"}
              iconOnly
              size="medium"
              onClick={onSidebarToggle}
              style={{ marginRight: "1rem" }}
            />
          </div>
        )}
      </div>
      <div className="landing-content flexRow gapLarge">
        <div className="flex1 flexRow alignItemsCenter">
          <a
            className="header-logo clickable"
            href="/"
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
          </a>
        </div>
        <div className="mobile-hide">
          <nav className="alignItemsCenter flexRow gapLarge header-nav">
            <NavButtons />
          </nav>
        </div>
        <nav className="mobile-show">
          <BfDsButton
            variant={showMenu ? "primary" : "ghost"}
            icon="menu"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          />
        </nav>
        {showMenu && (
          <div className="flexRow gapLarge sidebar-nav mobile-show-opacity">
            <NavButtons />
          </div>
        )}
      </div>
      <div className="flex1 selfAlignCenter" />
    </header>
  );
}
