import { useRef } from "react";
import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";

export const Home = iso(`
  field Query.Home @component {
    __typename
  }
`)(function Home({ data }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const substackRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSubstack = () => {
    if (substackRef.current) {
      substackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Hero Section */}
      <main 
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          padding: "2rem"
        }}
      >
        <div style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 2rem"
        }}>
          <div style={{
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {/* Github button */}
            <BfDsButton
              variant="primary"
              size="medium"
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            >
              ⭐ GitHub
            </BfDsButton>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              margin: "2rem 0 1rem",
              lineHeight: "1.2"
            }}>
              Structured prompts, reliable output
            </h1>
            <p style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              opacity: "0.9",
              lineHeight: "1.5"
            }}>
              Open source tooling to turn prompt engineering into more science
              than art through structured, testable prompts
            </p>
          </div>
        </div>
        <div style={{
          marginTop: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}>
          <BfDsButton 
            onClick={scrollToSubstack}
            variant="secondary"
            size="small"
          >
            ↓
          </BfDsButton>
        </div>
      </main>

      {/* Contact Section */}
      <section 
        ref={substackRef}
        style={{
          background: "#f8f9fa",
          padding: "4rem 0",
          flex: "1"
        }}
      >
        <div style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 2rem"
        }}>
          <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center"
          }}>
            <h2 style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              color: "#333"
            }}>
              Get in touch
            </h2>
            <div style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ marginBottom: 12 }}>
                We're happy to have you here. Join our community or reach out directly.
              </div>
              <div style={{ 
                display: "flex", 
                gap: 12, 
                flexDirection: "column", 
                alignItems: "flex-start" 
              }}>
                <BfDsButton
                  variant="primary"
                  size="medium"
                  href="https://discord.gg/tU5ksTBfEj"
                  target="_blank"
                >
                  🎮 Join Discord
                </BfDsButton>
                <BfDsButton
                  variant="primary"
                  size="medium"
                  href="mailto:dan@boltfoundry.com"
                >
                  📧 Email us
                </BfDsButton>
                <div style={{ marginTop: 12 }}>
                  <BfDsButton
                    variant="secondary"
                    size="small"
                    onClick={scrollToTop}
                  >
                    ↑ Back to top
                  </BfDsButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          background: "#2c3e50",
          color: "white",
          padding: "2rem 0"
        }}>
          <div style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center"
          }}>
            <div style={{ flex: "1" }}>
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="medium"
              variant="secondary"
              href="https://discord.gg/tU5ksTBfEj"
              target="_blank"
            >
              🎮
            </BfDsButton>
            <BfDsButton
              size="medium"
              variant="secondary"
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            >
              ⭐
            </BfDsButton>
          </div>
        </div>
      </section>
    </div>
  );
});