import { // @ts-types="react"
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import Matter from "matter-js";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "packages/bfDs/components/BfDsIcon.tsx";

// Game configuration
const GAME_CONFIG = {
  width: 600,
  height: 640,
  pegRows: 6,
  pegsPerRow: 7,
  pegSpacing: 85,
  pegVerticalSpacing: 80,
  startY: 120,
  ballSize: 17,
  pegSize: 10,
  binHeight: 65,
  scoreMultiplier: 1,
  promptHeight: 65,
  modelPadding: 10,
  containerGap: 15,
};

const colors = {
  yellow: "255, 215, 0",
  blue: "34, 217, 229",
  pink: "238, 130, 238",
  transparent: "0, 0, 0, 0",
};

// Visual container configuration
const CONTAINERS_CONFIG = {
  prompt: {
    backgroundColor: `rgba(${colors.pink}, 0.05)`,
    borderColor: `rgba(${colors.pink}, 0.15)`,
    borderWidth: "2px",
    borderRadius: "30px",
    height: GAME_CONFIG.promptHeight,
  },
  model: {
    backgroundColor: `rgba(${colors.blue}, 0.05)`,
    borderColor: `rgba(${colors.blue}, 0.15)`,
    borderWidth: "2px",
    borderRadius: "30px",
    height: GAME_CONFIG.height -
      GAME_CONFIG.promptHeight -
      GAME_CONFIG.containerGap -
      GAME_CONFIG.binHeight - GAME_CONFIG.containerGap,
  },
  output: {
    backgroundColor: `rgba(${colors.yellow}, 0.08)`,
    borderColor: `rgba(${colors.yellow}, 0.20)`,
    borderWidth: "2px",
    borderRadius: "30px",
    height: GAME_CONFIG.binHeight,
  },
};

// Calculate bins based on pegs per row
// const pointsArray = Array(GAME_CONFIG.pegsPerRow).fill(0).map((_, i) => {
//   const mid = Math.floor(GAME_CONFIG.pegsPerRow / 2);
//   const distance = Math.abs(i - mid);
//   return (mid - distance + 1) * 25 * GAME_CONFIG.scoreMultiplier;
// });
const pointsArray = [0, 1, 2, 3, 2, 1, 0];
const BINS_CONFIG = {
  count: GAME_CONFIG.pegsPerRow,
  points: pointsArray,
};

export function Plinko() {
  const [score, setScore] = useState(0);
  const [ballStartX, setBallStartX] = useState(GAME_CONFIG.width / 2);
  const [numBalls, setNumBalls] = useState(1);
  const [numBallsLeft, setNumBallsLeft] = useState(numBalls);
  const [fineTuned, setFineTuned] = useState(false);
  const [binsLinePositions, setBinsLinePositions] = useState<number[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const runnerRef = useRef<Matter.Runner>();

  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);

  const moveLeft = () => {
    setBallStartX((prev) => Math.max(20, prev - 20));
  };

  const moveRight = () => {
    setBallStartX((prev) => Math.min(GAME_CONFIG.width - 20, prev + 20));
  };

  useEffect(() => {
    if (!isLeftPressed && !isRightPressed) return;

    // Immediate move
    if (isLeftPressed) moveLeft();
    if (isRightPressed) moveRight();

    let intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (isLeftPressed) moveLeft();
        if (isRightPressed) moveRight();
      }, 100);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isLeftPressed, isRightPressed]);

  useEffect(() => {
    if (numBallsLeft !== numBalls) {
      setNumBallsLeft(numBalls);
    }
  }, [numBalls]);

  useEffect(() => {
    if (!engineRef.current) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const pegs = bodies.filter((body) => body.label?.startsWith("peg-"));

    pegs.forEach((peg) => {
      const colStr = peg.label.split("-")[2];
      let col = parseInt(colStr, 10);
      const rowStr = peg.label.split("-")[1];
      const row = parseInt(rowStr, 10);
      const numCols = GAME_CONFIG.pegsPerRow;
      let scale = 1;
      if (row % 2 !== 0) {
        col += 0.5;
      }

      if (fineTuned) {
        scale = 1;
        if (
          col <= Math.floor(numCols * 0.4) || col >= Math.floor(numCols * 0.6)
        ) {
          scale = 2;
        }
        if (
          col <= Math.floor(numCols * 0.3) || col >= Math.floor(numCols * 0.7)
        ) {
          scale = 3;
        }
        if (
          col <= Math.floor(numCols * 0.2) || col >= Math.floor(numCols * 0.8)
        ) {
          scale = 4;
        }
      } else {
        // reset scale
        scale = 1;
        if (
          col <= Math.floor(numCols * 0.4) || col >= Math.floor(numCols * 0.6)
        ) {
          scale = 1 / 2;
        }
        if (
          col <= Math.floor(numCols * 0.3) || col >= Math.floor(numCols * 0.7)
        ) {
          scale = 1 / 3;
        }
        if (
          col <= Math.floor(numCols * 0.2) || col >= Math.floor(numCols * 0.8)
        ) {
          scale = 1 / 4;
        }
      }

      // const currentScale = peg.scale ? peg.scale.x : 1;
      // const duration = 500;
      // const startScale = currentScale;
      const endScale = scale;
      // const startTime = Date.now();

      Matter.Body.scale(peg, endScale, endScale);

      // TODO: Figure out why this animates to infinity scale
      // most likely because it is compounding the scale every time

      // const animate = () => {
      //   const elapsed = Date.now() - startTime;
      //   const progress = Math.min(elapsed / duration, 1);
      //   // Ease in-out cubic
      //   const easeProgress = progress < 0.5
      //     ? 4 * progress * progress * progress
      //     : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      //   console.log("progress", easeProgress);

      //   const currentScale = startScale +
      //     (endScale - startScale) * easeProgress;
      //   console.log("currentScale", currentScale);
      //   const prevScale = peg.scale ? peg.scale.x : 1;
      //   console.log("prevScale", prevScale)
      //   Matter.Body.scale(peg, currentScale / prevScale, currentScale / prevScale);

      //   if (progress < 1) {
      //     requestAnimationFrame(animate);
      //   }
      // };

      // animate();
    });
  }, [fineTuned]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies;

    const engine = Engine.create();
    engine.gravity.y = 0.5;
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        wireframes: false,
        background: `rgba(${colors.transparent})`,
      },
    });
    renderRef.current = render;

    const runner = Runner.create();
    runnerRef.current = runner;

    // Add scoring bins
    const bins = [];
    const binsLinePositions = [];
    const binWidth = GAME_CONFIG.width / BINS_CONFIG.count;

    for (let i = 0; i <= BINS_CONFIG.count; i++) {
      binsLinePositions.push(i * binWidth);
      bins.push(
        Bodies.rectangle(
          i * binWidth,
          GAME_CONFIG.height - GAME_CONFIG.binHeight / 2,
          2,
          GAME_CONFIG.binHeight,
          {
            isStatic: true,
            label: `bin-${BINS_CONFIG.points[i]}`,
            render: { fillStyle: `rgba(${colors.yellow}, 0)` },
          },
        ),
      );
    }
    setBinsLinePositions(binsLinePositions);

    // Create walls
    const walls = [
      Bodies.rectangle(
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height,
        GAME_CONFIG.width,
        10,
        {
          isStatic: true,
          render: { fillStyle: `rgba(${colors.transparent})` },
        },
      ), // bottom
      Bodies.rectangle(0, GAME_CONFIG.height / 2, 10, GAME_CONFIG.height, {
        isStatic: true,
        render: { fillStyle: `rgba(${colors.transparent})` },
      }), // left
      Bodies.rectangle(
        GAME_CONFIG.width,
        GAME_CONFIG.height / 2,
        10,
        GAME_CONFIG.height,
        {
          isStatic: true,
          render: { fillStyle: `rgba(${colors.transparent})` },
        },
      ), // right
    ];

    // Create pegs
    const pegs = [];
    for (let row = 0; row < GAME_CONFIG.pegRows; row++) {
      const numCols = GAME_CONFIG.pegsPerRow - (row % 2);
      const startX =
        (GAME_CONFIG.width - (numCols - 1) * GAME_CONFIG.pegSpacing) / 2;

      for (let col = 0; col < numCols; col++) {
        const x = startX + col * GAME_CONFIG.pegSpacing;
        const y = row * GAME_CONFIG.pegVerticalSpacing + GAME_CONFIG.startY;
        const peg = Bodies.circle(
          x,
          y,
          GAME_CONFIG.pegSize,
          {
            isStatic: true,
            render: { fillStyle: `rgba(${colors.blue}, 1)` },
            label: `peg-${row}-${col}`,
          },
        );
        pegs.push(peg);
      }
    }

    World.add(engine.world, [...walls, ...pegs, ...bins]);
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const dropBall = async () => {
    if (!engineRef.current) return;
    setNumBallsLeft(numBalls);
    let droppedBalls = 0;

    for (let i = 0; i < numBalls; i++) {
      const ball = Matter.Bodies.circle(
        // randomize start position within 3 pixels left or right of center
        ballStartX + ((Math.random() < 0.5 ? -1 : 1) * Math.random() * 3),
        30,
        GAME_CONFIG.ballSize,
        {
          restitution: 0.8,
          friction: 0.05,
          density: 0.001,
          label: `ball-${i}`,
          render: {
            fillStyle: `rgba(${colors.pink}, 1)`,
            // sprite: {
            //   texture: "/static/assets/images/puck.jpg",
            // },
          },
        },
      );

      Matter.World.add(engineRef.current.world, ball);
      setNumBallsLeft(numBalls - i - 1);

      droppedBalls++;
      if (droppedBalls === numBalls) {
        setNumBallsLeft(numBalls);
      }

      const intervalId = setInterval(() => {
        if (ball.position.y > GAME_CONFIG.height - GAME_CONFIG.binHeight) {
          const binIndex = Math.floor(
            ball.position.x / (GAME_CONFIG.width / BINS_CONFIG.count),
          );
          const points = BINS_CONFIG.points[binIndex] || 0;
          setScore((prev) => prev + points);
          clearInterval(intervalId);
        }
      }, 100);

      if (i < numBalls - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  };

  const clearBalls = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach((body) => {
      if (body.label?.startsWith("ball")) {
        Matter.World.remove(engineRef.current.world, body);
      }
    });
  };

  const baseStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    width: "100%",
    zIndex: 1,
    pointerEvents: "none",
    boxSizing: "border-box",
  };

  const middleIndex = Math.floor((binsLinePositions.length - 1) / 2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--background)",
      }}
    >
      <div className="plinko-controls">
        <h2>
          Adjust prompt<br />or temperature
        </h2>
        <div className="flexRow gapMedium">
          <BfDsButton
            kind="outlineAccent"
            onMouseDown={() => setIsLeftPressed(true)}
            onMouseUp={() => setIsLeftPressed(false)}
            onMouseLeave={() => setIsLeftPressed(false)}
            iconLeft="arrowLeft"
          />
          <BfDsButton
            kind="accent"
            onClick={dropBall}
            text="Drop"
          />
          <BfDsButton
            kind="outlineAccent"
            onMouseDown={() => setIsRightPressed(true)}
            onMouseUp={() => setIsRightPressed(false)}
            onMouseLeave={() => setIsRightPressed(false)}
            iconRight="arrowRight"
          />
        </div>
        <h2>Context size</h2>
        <div className="flexRow gapMedium">
          <BfDsButton
            kind={numBalls === 1 ? "filledAccent" : "secondary"}
            onClick={() => {
              setNumBalls(1);
            }}
            textIconLeft="1"
          />
          <BfDsButton
            kind={numBalls === 3 ? "filledAccent" : "secondary"}
            onClick={() => {
              setNumBalls(3);
            }}
            textIconLeft="3"
          />
          <BfDsButton
            kind={numBalls === 10 ? "filledAccent" : "secondary"}
            onClick={() => {
              setNumBalls(10);
            }}
            textIconLeft="10"
          />
        </div>
        <h2>Fine tuning</h2>
        <BfDsButton
          kind={fineTuned ? "success" : "secondary"}
          onClick={() => {
            setNumBalls(1);
            setFineTuned(!fineTuned);
          }}
          text={fineTuned ? "Revert fine tuning" : "Fine tune model"}
        />
        <div style={{ marginTop: 28 }}>
          <div>Score: {score}</div>
          <BfDsButton
            kind="outlineAlert"
            iconLeft="cross"
            onClick={clearBalls}
            size="medium"
            text="Clear"
          />
        </div>
      </div>
      <div
        className="plinko-scene"
        ref={sceneRef}
        onClick={dropBall}
        style={{
          cursor: "pointer",
          position: "relative",
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
          marginRight: 75,
        }}
      >
        {/* Prompt container */}
        <div
          style={{
            ...baseStyle,
            top: 0,
            height: CONTAINERS_CONFIG.prompt.height,
            backgroundColor: CONTAINERS_CONFIG.prompt.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.prompt.borderRadius,
            border:
              `${CONTAINERS_CONFIG.prompt.borderWidth} solid ${CONTAINERS_CONFIG.prompt.borderColor}`,
          }}
        >
          <div
            className="sideTitle"
            style={{
              color: `rgba(${colors.pink}, 1)`,
            }}
          >
            Prompt
          </div>
        </div>

        {/* Model container */}
        <div
          style={{
            ...baseStyle,
            top: CONTAINERS_CONFIG.prompt.height + GAME_CONFIG.containerGap,
            height: CONTAINERS_CONFIG.model.height,
            backgroundColor: CONTAINERS_CONFIG.model.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.model.borderRadius,
            border:
              `${CONTAINERS_CONFIG.model.borderWidth} solid ${CONTAINERS_CONFIG.model.borderColor}`,
          }}
        >
          <div
            className="sideTitle"
            style={{
              color: `rgba(${colors.blue}, 1)`,
            }}
          >
            Model
          </div>
        </div>

        {/* Output container */}
        <div
          style={{
            ...baseStyle,
            bottom: 0,
            height: CONTAINERS_CONFIG.output.height,
            backgroundColor: CONTAINERS_CONFIG.output.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.output.borderRadius,
            border:
              `${CONTAINERS_CONFIG.output.borderWidth} solid ${CONTAINERS_CONFIG.output.borderColor}`,
          }}
        >
          {/* Lines */}
          {binsLinePositions.map((position, index) => {
            // don't render first and last line
            if (index === 0 || index === binsLinePositions.length - 1) return;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: position - 2,
                  top: 4,
                  width: 4,
                  height: "calc(100% - 8px)",
                  backgroundColor: `rgba(${colors.yellow}, 0.85)`,
                  borderRadius: 4,
                }}
              />
            );
          })}
          {/* Stars */}
          <div
            className="starBox star1"
            style={{
              height: GAME_CONFIG.binHeight,
              left: binsLinePositions[
                middleIndex - 2
              ],
              width: binsLinePositions[
                middleIndex - 1
              ] - binsLinePositions[
                middleIndex - 2
              ],
            }}
          >
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
          </div>
          <div
            className="starBox star2"
            style={{
              height: GAME_CONFIG.binHeight,
              left: binsLinePositions[
                middleIndex - 1
              ],
              width: binsLinePositions[
                middleIndex
              ] - binsLinePositions[
                middleIndex - 1
              ],
            }}
          >
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
          </div>
          <div
            className="starBox star3"
            style={{
              height: GAME_CONFIG.binHeight,
              left: binsLinePositions[middleIndex],
              width: binsLinePositions[
                middleIndex + 1
              ] - binsLinePositions[
                middleIndex
              ],
            }}
          >
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
          </div>
          <div
            className="starBox star2"
            style={{
              height: GAME_CONFIG.binHeight,
              left: binsLinePositions[
                middleIndex + 1
              ],
              width: binsLinePositions[
                middleIndex + 2
              ] - binsLinePositions[
                middleIndex + 1
              ],
            }}
          >
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
          </div>
          <div
            className="starBox star1"
            style={{
              height: GAME_CONFIG.binHeight,
              left: binsLinePositions[middleIndex + 2],
              width: binsLinePositions[
                middleIndex + 3
              ] - binsLinePositions[
                middleIndex + 2
              ],
            }}
          >
            <div>
              <BfDsIcon
                name="starSolid"
                color={`rgba(${colors.yellow}, 1)`}
                size={32}
              />
            </div>
          </div>
          <div
            className="sideTitle"
            style={{
              color: `rgba(${colors.yellow}, 1)`,
            }}
          >
            Output
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: `${ballStartX - GAME_CONFIG.ballSize}px`,
            top: "16px",
            width: `${GAME_CONFIG.ballSize * 2}px`,
            height: `${GAME_CONFIG.ballSize * 2}px`,
            borderRadius: "50%",
            backgroundColor: `rgba(${colors.pink}, 0.25)`,
            pointerEvents: "none",
            lineHeight: "34px",
            textAlign: "center",
            color: `rgba(${colors.pink}, 1)`,
            fontWeight: "bold",
          }}
        />
      </div>
    </div>
  );
}
