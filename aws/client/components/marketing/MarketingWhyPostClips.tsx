import { React } from "aws/client/deps.ts";

const styles: Record<string, React.CSSProperties> = {
  why: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 30px 60px",
  },
  whyContainer: {
    flex: 1.25,
    display: "grid",
    gridTemplateColumns: ".5fr 1fr .5fr 1fr .5fr 1fr .5fr",
    gridTemplateRows: "repeat(2, 1fr)",
    placeItems: "center",
    gap: 20,
    position: "relative",
  },
  whyRow: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    width: "min(60rem, 100%)",
  },
  text: {
    aspectRatio: 1,
    display: "flex",
    textAlign: "center",
    fontSize: 20,
  },
  textTop: {
    gridArea: "1 / 3 / 2 / 6",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textRight: {
    gridArea: "2 / 5 / 3 / 8",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textLeft: {
    gridArea: "2 / 1 / 3 / 4",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  textBox: {
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  textHighlight: {
    background: "var(--secondaryColor015)",
  },
  arrow: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "scale(0.6)",
  },
  arrowTop: {
    gridArea: "1 / 6 / 2 / 8",
    transformOrigin: "bottom left",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  arrowRight: {
    gridArea: "2 / 4 / 3 / 5",
  },
  arrowLeft: {
    gridArea: "1 / 1 / 2 / 3",
    transformOrigin: "bottom right",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  detailText: {
    flex: 0.75,
    fontSize: 24,
    textAlign: "center",
    background: "var(--secondaryColor)",
    color: "white",
    borderRadius: 8,
    padding: 20,
  },
};

type ArrowProps = {
  rotate: number;
  highlight: boolean;
};

const arrowColor = "var(--border)";
const arrowHighlight = "var(--secondaryColor)";
const ArrowSvg = ({ rotate, highlight }: ArrowProps) => {
  // Unique IDs for gradient and animation
  const gradientId = `arrowGradient-${rotate}`;
  const arrowRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svgElement = arrowRef.current;
    if (highlight && svgElement) {
      // Create animation for the first stop
      const animateFirstStop = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate",
      );
      animateFirstStop.setAttribute("attributeName", "offset");
      animateFirstStop.setAttribute("values", "0;0.8");
      animateFirstStop.setAttribute("dur", "5s");
      animateFirstStop.setAttribute("repeatCount", "indefinite");

      // Create animation for the second stop
      const animateSecondStop = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate",
      );
      animateSecondStop.setAttribute("attributeName", "offset");
      animateSecondStop.setAttribute("values", "0;1");
      animateSecondStop.setAttribute("dur", "5s");
      animateSecondStop.setAttribute("repeatCount", "indefinite");

      // Append animations to the stops
      const stops = svgElement.querySelectorAll(`#${gradientId} stop`);
      if (stops.length >= 2) {
        stops[0].appendChild(animateFirstStop);
        stops[1].appendChild(animateSecondStop);
        animateFirstStop.beginElement();
        animateSecondStop.beginElement();
      }
    }
  }, [highlight, gradientId]);

  return (
    <svg
      ref={arrowRef}
      width="89"
      height="111"
      viewBox="0 0 89 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {
            /* <stop
            offset="0"
            stopColor={highlight ? arrowHighlight : arrowColor}
          />
          <stop offset="1" stopColor={arrowColor} /> */
          }
          <stop
            offset="0"
            stopColor={highlight ? arrowHighlight : arrowColor}
            stopOpacity="1"
          >
            <animate
              attributeName="offset"
              values="0;1"
              dur="5s"
              repeatCount="infinite"
            />
          </stop>
          <stop offset="0" stopColor={arrowColor} stopOpacity="1">
            <animate
              attributeName="offset"
              values="0;1"
              dur="4s"
              repeatCount="infinite"
            />
          </stop>
        </linearGradient>
      </defs>
      <path
        d="M87.65 94.58C86.09 93.02 83.55 93.02 81.99 94.58L78.99 97.58C77.18 77.26 70.07 57.92 58.18 41.21C44.93 22.58 26.69 8.42004 5.42998 0.270042C3.36998 -0.519958 1.05998 0.510042 0.269981 2.57004C-0.520019 4.63004 0.509981 6.95004 2.56998 7.74004C22.35 15.33 39.33 28.5 51.66 45.85C62.39 60.94 68.93 78.32 70.85 96.61L68.78 94.54C67.22 92.98 64.68 92.98 63.12 94.54C61.56 96.1 61.56 98.63 63.12 100.2L71.87 108.95C72.81 109.89 74.07 110.41 75.41 110.41C76.75 110.41 78 109.89 78.94 108.95L87.65 100.25C89.21 98.69 89.21 96.16 87.65 94.59V94.58Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default function MarketingWhyPostClips() {
  const [highlight, setHighlight] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalId = React.useRef<number | null>(null);

  const startRotation = () => {
    intervalId.current = setInterval(() => {
      setHighlight((highlight) => (highlight + 1) % 3);
    }, 5000);
  };

  const stopRotation = () => {
    if (intervalId.current) clearInterval(intervalId.current);
  };

  React.useEffect(() => {
    if (!isPaused) {
      startRotation();
    }
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isPaused]);

  const handleMouseEnter = (hover: number) => {
    setIsPaused(true);
    setHighlight(hover);
    stopRotation();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startRotation();
  };

  return (
    <div style={styles.why}>
      <h2>Why Post Clips?</h2>
      <div className="row-column" style={styles.whyRow}>
        <div style={styles.whyContainer}>
          <div style={{ ...styles.text, ...styles.textTop }}>
            <div
              style={{
                ...styles.textBox,
                ...(highlight === 0 && styles.textHighlight),
              }}
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={handleMouseLeave}
            >
              Book the best comics
            </div>
          </div>
          <div style={{ ...styles.arrow, ...styles.arrowTop }}>
            <ArrowSvg rotate={0} highlight={!isPaused && highlight === 0} />
          </div>
          <div style={{ ...styles.text, ...styles.textRight }}>
            <div
              style={{
                ...styles.textBox,
                ...(highlight === 1 && styles.textHighlight),
              }}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
            >
              Boost ticket sales
            </div>
          </div>
          <div style={{ ...styles.arrow, ...styles.arrowRight }}>
            <ArrowSvg rotate={127} highlight={!isPaused && highlight === 1} />
          </div>
          <div style={{ ...styles.text, ...styles.textLeft }}>
            <div
              style={{
                ...styles.textBox,
                ...(highlight === 2 && styles.textHighlight),
              }}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
            >
              Build your own audience
            </div>
          </div>
          <div style={{ ...styles.arrow, ...styles.arrowLeft }}>
            <ArrowSvg rotate={255} highlight={!isPaused && highlight === 2} />
          </div>
        </div>
        <div
          style={styles.detailText}
          onMouseEnter={() => handleMouseEnter(highlight)}
          onMouseLeave={handleMouseLeave}
        >
          {highlight === 0 && (
            <p>
              Before you talk to a comedian, show them what your brand is all
              about. Post high quality clips with lots of views shows comics
              your club is a great place to perform. Better comics means better
              clips, better clips means better comics.
            </p>
          )}
          {highlight === 1 && (
            <p>
              Instead of relying on comics to bring the audience, create your
              own story. Boost your best standup clips as ads, to show the
              audience what they get when they buy a ticket.
            </p>
          )}
          {highlight === 2 && (
            <p>
              Make your own site the best showcase of your business. Instead of
              relying on third party ticketing sites and social media, drive
              people to your own website, and learn who your best customers are.
              Make more of your customers repeat customers.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
