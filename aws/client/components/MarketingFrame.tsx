import { React } from "aws/client/deps.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import Logo from "aws/client/images/bf-logo.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import { Link } from "aws/client/components/Link.tsx";
import MarketingLoginAction from "aws/client/components/MarketingLoginAction.tsx";
import Icon from "aws/client/ui_components/Icon.tsx";

type Props = {
  closeModal?: () => void;
  header?: string;
  modal?: React.ReactNode | null;
  showLoginLink?: boolean;
  showFooter?: boolean;
  setForceScroll?: (forceScroll: boolean) => void;
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    scrollMarginTop: "10vh",
    fontFamily: fonts.fontFamily,
    background: "var(--background)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  navBar: {
    display: "flex",
    alignItems: "center",
    padding: "2vh",
    minHeight: 32,
    position: "sticky",
    zIndex: 10,
    top: 0,
    background: "var(--transparentBackground)",
    backdropFilter: "blur(3px)",
  },
  footer: {
    minHeight: "5vh",
    display: "flex",
    justifyContent: "end",
    gap: "1.3vw",
    padding: 10,
    paddingRight: 88,
  },
  h1: {
    fontSize: "max(24px, 5vw)",
    margin: "0 10% 2.5vw",
    flexShrink: 1,
    fontWeight: "bold",
  },
  logo: {
    width: "15%",
    minWidth: 150,
  },
  rightSide: {
    gap: 8,
    flex: "auto",
    textAlign: "right",
  },
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    width: "100%",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "var(--background)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: 15,
    border: "3px solid white",
    margin: "0 5%",
    position: "relative",
  },
  modalContent: {
    padding: "3% 7%",
  },
  closeButton: {
    fontSize: "max(14px, 4vw)",
    cursor: "pointer",
    position: "absolute",
    top: 0,
    right: "1%",
  },
};

export default function MarketingFrame(
  {
    children,
    closeModal,
    header,
    modal,
    showLoginLink,
    showFooter,
    setForceScroll,
  }: React.PropsWithChildren<
    Props
  >,
) {
  const h1Style: React.CSSProperties = {
    fontFamily: fonts.marketingFontFamily,
    ...styles.h1,
  };
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="marketing" style={styles.page}>
      <nav className="nav start-center" style={styles.navBar}>
        <div style={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        {showLoginLink && (
          <div className="nav-links mobile-hide" style={styles.rightSide}>
            <MarketingLoginAction
              setForceScroll={setForceScroll}
            />
          </div>
        )}
        <div
          className="mobile-show"
          style={{ ...styles.rightSide, flexDirection: "column" }}
        >
          <Button
            kind="overlay"
            iconLeft="burgerMenu"
            onClick={() => {
              if (!showMenu) setShowMenu(true);
              else setShowMenu(false);
            }}
          />
          {showMenu && (
            <div className="nav-links-burger mobile-show">
              <MarketingLoginAction
                setForceScroll={setForceScroll}
              />
            </div>
          )}
        </div>
      </nav>
      {header && <h1 className="marketing-h1" style={h1Style}>{header}</h1>}

      {children}

      {showFooter && (
        <div className="footer" style={styles.footer}>
          <Button
            kind="overlay"
            text="Terms and Privacy"
            href="/terms"
            hrefTarget="blank"
            testId="button-terms-footer"
          />
          <Button
            iconLeft="brand-tiktok"
            kind="gradientOverlay"
            href="https://www.tiktok.com/@bolt.foundry"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on TikTok!"
            role="TikTok social media link"
            testId="button-tiktok-footer"
          />
          <Button
            iconLeft="brand-instagram"
            kind="gradientOverlay"
            href="https://www.instagram.com/boltfoundry/"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on Instagram!"
            role="Instagram social media link"
            testId="button-instagram-footer"
          />
          <Button
            iconLeft="brand-threads"
            kind="gradientOverlay"
            href="https://www.threads.net/@boltfoundry"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on Threads!"
            role="Threads social media link"
            testId="button-threads-footer"
          />
          <Button
            iconLeft="brand-discord"
            kind="gradientOverlay"
            href="https://discord.gg/ZTVJkfxHkC"
            hrefTarget="_blank"
            size="large"
            tooltip="Join our Discord!"
            tooltipPosition="top"
            tooltipJustification="end"
            role="Discord social media link"
            testId="button-discord-footer"
          />
          {
            /* <Button
          iconLeft="brand-facebook"
          kind="overlay"
          href="https://www.facebook.com/boltfoundry"
          hrefTarget="_blank"
          size="large"
        /> */
          }
        </div>
      )}
      {modal != null && (
        <div className="marketingModal" style={styles.modalBackground}>
          <div style={styles.modal}>
            <div style={styles.closeButton} onClick={closeModal}>
              &#x2716;
            </div>
            <div style={styles.modalContent}>
              {modal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
