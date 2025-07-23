import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { BfDsSpinner } from "@bfmono/apps/bfDs/components/BfDsSpinner.tsx";
import { BfDsRange } from "@bfmono/apps/bfDs/components/BfDsRange.tsx";
import { classnames } from "@bfmono/lib/classnames.ts";

// TODO: Where should this go?
// import "@bfmono/apps/boltfoundry-com/components/plinko/plinko.css"

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
const FINE_TUNE_CONFIG = [
  {
    position: 0.4,
    multiplier: 2,
  },
  {
    position: 0.25,
    multiplier: 3,
  },
];

const colors = {
  "yellow": "255, 215, 0",
  "blue": "34, 217, 229",
  "pink": "238, 130, 238",
  "transparent": "0, 0, 0, 0",
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
const pointsArray = Array(GAME_CONFIG.pegsPerRow).fill(0).map((_, i) => {
  const mid = Math.floor(GAME_CONFIG.pegsPerRow / 2);
  const distance = Math.abs(i - mid);
  // e.g. [0, 1, 2, 3, 2, 1, 0]
  return (3 - Math.min(distance, 3)) * GAME_CONFIG.scoreMultiplier;
});

const BINS_CONFIG = {
  count: GAME_CONFIG.pegsPerRow,
  points: pointsArray,
};

export function Plinko() {
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [ballStartX, setBallStartX] = useState(GAME_CONFIG.width / 2);
  const [temp, setTemp] = useState(0.8);
  const [ballsInPlay, setBallsInPlay] = useState(0);
  const [context, setContext] = useState(0);
  const [binsLinePositions, setBinsLinePositions] = useState<Array<number>>([]);
  const [pegsScaleTo, setPegsScaleTo] = useState<Map<Matter.Body, number>>(
    new Map(),
  );
  const prevContextRef = useRef(context);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);
  const [isDownPressed, setIsDownPressed] = useState(false);
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isFPressed, setIsFPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const moveLeft = () => {
    setBallStartX((prev) => Math.max(20, prev - 20));
  };

  const moveRight = () => {
    setBallStartX((prev) => Math.min(GAME_CONFIG.width - 20, prev + 20));
  };

  const decreaseTemp = () => {
    setTemp((prev) => Math.round(Math.max(0, prev - 0.1) * 10) / 10);
  };

  const increaseTemp = () => {
    setTemp((prev) => Math.round(Math.min(1, prev + 0.1) * 10) / 10);
  };

  // DELETE? const setPegScaleTo = (peg: Matter.Body, scale: number) => {
  //   setPegsScaleTo((prev) => new Map(prev).set(peg, scale));
  // };

  useEffect(() => {
    prevContextRef.current = context;
  }, [context]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (e.metaKey) {
          e.preventDefault();
          moveLeft();
        } else {
          setIsLeftPressed(true);
        }
      }
      if (e.key === "ArrowRight") {
        if (e.metaKey) {
          e.preventDefault();
          moveRight();
        } else {
          setIsRightPressed(true);
        }
      }
      if (e.key === "ArrowDown") setIsDownPressed(true);
      if (e.key === "ArrowUp") setIsUpPressed(true);
      if (e.key === "f") setIsFPressed(true);
      if (e.key === "Delete" || e.key === "Backspace") setIsDeletePressed(true);
      if (e.key === " ") setIsSpacePressed(true);
    };

    const handleKeyUp = () => {
      // Reset all key states on any key up
      setIsLeftPressed(false);
      setIsRightPressed(false);
      setIsDownPressed(false);
      setIsUpPressed(false);
      setIsFPressed(false);
      setIsDeletePressed(false);
      setIsSpacePressed(false);
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    globalThis.addEventListener("keyup", handleKeyUp);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      globalThis.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (
      !isLeftPressed && !isRightPressed && !isDownPressed && !isUpPressed &&
      !isDeletePressed && !isSpacePressed
    ) return;

    // Immediate move
    if (isLeftPressed) decreaseTemp();
    if (isRightPressed) increaseTemp();
    if (isDownPressed) setContext(context >= 3 ? 3 : context + 1);
    if (isUpPressed) setContext(context <= -3 ? -3 : context - 1);
    if (isDeletePressed) clearBalls();
    if (isSpacePressed) dropBall();

    let intervalId: number;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (isLeftPressed) decreaseTemp();
        if (isRightPressed) increaseTemp();
      }, 100);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [
    isLeftPressed,
    isRightPressed,
    isDownPressed,
    isUpPressed,
    isFPressed,
    isDeletePressed,
    isSpacePressed,
  ]);

  useEffect(() => {
    if (!engineRef.current) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const pegs = bodies.filter((body) => body.label?.startsWith("peg-"));

    // Store current scales as the starting point for animation
    const currentScales = new Map<Matter.Body, number>();
    pegs.forEach((peg) => {
      // Use the scale the peg is currently transitioning to (or has reached)
      currentScales.set(peg, pegsScaleTo.get(peg) || 1);
    });

    // Create a new map to track the scales we're transitioning to in this update
    const newScales = new Map<Matter.Body, number>();

    pegs.forEach((peg) => {
      const colStr = peg.label.split("-")[2];
      let col = parseInt(colStr, 10);
      const rowStr = peg.label.split("-")[1];
      const row = parseInt(rowStr, 10);
      const numCols = GAME_CONFIG.pegsPerRow;
      let targetScale = 1;
      if (row % 2 !== 0) {
        col += 0.5;
      }

      if (context > 0) {
        targetScale = 1;
        for (const config of FINE_TUNE_CONFIG) {
          if (
            col <= Math.floor(numCols * config.position) ||
            col >= Math.floor(numCols * (1 - config.position))
          ) {
            // Scale from 1 to config.multiplier based on context (1-3)
            const scaleFactor = 1 + ((config.multiplier - 1) * (context / 3));
            targetScale = scaleFactor;
          }
        }
      } else if (context < 0) {
        // Random scaling for negative context values
        const chaos = Math.abs(context) / 3; // 0.33 for -1, 0.67 for -2, 1.0 for -3
        const maxRandomScale = 1 + (2 * chaos); // Max scale of 3 at context -3

        // Generate random scale between 1 and maxRandomScale
        targetScale = 1 + (Math.random() * (maxRandomScale - 1));
      } else {
        // context === 0: reset all pegs to original scale
        // DELETE? const currentScale = currentScales.get(peg) || 1;
        // DELETE? const scalingFactor = 1 / currentScale; // This is what we apply to Matter.js
        targetScale = 1; // This is what we want to track as the final scale
      }

      const duration = 500;
      const startScale = currentScales.get(peg) || 1;

      // Calculate the scaling factor for Matter.js (for reset case, this is different from targetScale)
      // DELETE? const scalingFactor = context === 0 ? 1 / startScale : targetScale;

      // Store the scale we're transitioning to immediately
      newScales.set(peg, targetScale);

      // Calculate delay based on row and column to make a wave
      const frameDelay = 2;
      const msPerFrame = 1000 / 60;
      const rowDelay = row * frameDelay * msPerFrame;
      const colDelay = col * frameDelay * msPerFrame;
      const totalDelay = rowDelay + colDelay;

      setTimeout(() => {
        const startTime = Date.now();
        let currentScale = startScale;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease in-out cubic
          const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const newScale = startScale +
            (targetScale - startScale) * easeProgress;
          const scaleRatio = newScale / currentScale;

          Matter.Body.scale(peg, scaleRatio, scaleRatio);
          currentScale = newScale;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }, totalDelay);
    });

    // Update all the scales we're transitioning to
    setPegsScaleTo((prev) => {
      const updated = new Map(prev);
      newScales.forEach((scale, peg) => {
        updated.set(peg, scale);
      });
      return updated;
    });
  }, [context]);

  useEffect(() => {
    if (!sceneRef.current) return;
    setIsLoading(true);

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
    setIsLoading(false);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const dropBall = () => {
    if (!engineRef.current) return;

    const ball = Matter.Bodies.circle(
      // randomize start position within 3 pixels left or right of center
      ballStartX + ((Math.random() < 0.5 ? -1 : 1) * Math.random() * 3),
      30,
      GAME_CONFIG.ballSize,
      {
        restitution: temp,
        friction: 0.05,
        density: 0.001,
        label: `ball`,
        render: { fillStyle: `rgba(${colors.pink}, 1)` },
      },
    );

    Matter.World.add(engineRef.current.world, ball);
    setBallsInPlay(ballsInPlay + 1);

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
  };

  const clearBalls = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach((body) => {
      if (body.label?.startsWith("ball") && engineRef.current) {
        Matter.World.remove(engineRef.current.world, body);
      }
    });
    setBallsInPlay(0);
    setScore(0);
  };

  const handleDragPuck = (e: MouseEvent) => {
    const startX = e.clientX;
    const startPuckX = ballStartX;
    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      hasMoved = true;
      const dx = e.clientX - startX;
      const newX = Math.min(
        Math.max(20, startPuckX + dx),
        GAME_CONFIG.width - 20,
      );
      setBallStartX(newX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!hasMoved) {
        dropBall();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const middleIndex = Math.floor((binsLinePositions.length - 1) / 2);

  const plinkoSceneFade = classnames([
    "plinko-scene",
    {
      active: !isLoading,
    },
  ]);

  return (
    <div className="plinko">
      <div className="plinko-controls">
        <h2>Input</h2>
        <div className="plinko-controls-text">
          Drag the puck left and right, then click anywhere to drop
        </div>
        <h2>
          Temperature
          <div
            className="headerValue"
            style={{
              background: `rgba(${colors.pink}, 0.15)`,
              color: `rgb(${colors.pink})`,
            }}
          >
            {temp}
          </div>
        </h2>
        <div className="plinko-controls-text">
          Use arrows to adjust puck's bounciness
        </div>
        <BfDsRange
          color={`rgb(${colors.pink})`}
          min={0}
          max={1}
          step={0.1}
          showTicks
          tickLabels={[
            { value: 0, label: "0" },
            { value: 0.5, label: " " },
            { value: 1, label: "1" },
          ]}
          showValue={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTemp(parseFloat(e.target.value))}
          value={temp}
        />
        <h2>
          Context quality
          <div
            className="headerValue"
            style={{
              background: `rgba(${colors.blue}, 0.15)`,
              color: `rgb(${colors.blue})`,
            }}
          >
            {context}
          </div>
        </h2>
        <div className="plinko-controls-text">
          Refining the context helps focus the puck's path
        </div>
        <BfDsRange
          color={`rgb(${colors.blue})`}
          min={-3}
          max={3}
          step={1}
          showTicks
          tickLabels={[
            { value: -3, label: "Worst" },
            { value: 0, label: " " },
            { value: 3, label: "Best" },
          ]}
          showValue={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContext(parseInt(e.target.value))}
          value={context}
        />
        <div style={{ marginTop: 28 }}>
          <div className="plinko-stat">
            <div className="plinko-stat-header">Pucks</div>
            <div>{ballsInPlay}</div>
          </div>
          <div className="plinko-stat">
            <div className="plinko-stat-header">Score</div>
            <div>{score}</div>
          </div>
          <div className="plinko-stat">
            <div className="plinko-stat-header">Average</div>
            <div>
              {ballsInPlay > 0
                ? Math.round(score / ballsInPlay * 10) / 10
                : "--"}
            </div>
          </div>
          <BfDsButton
            variant="outline"
            icon="cross"
            onClick={clearBalls}
            size="medium"
          >
            Clear
          </BfDsButton>
        </div>
      </div>
      <div
        className={plinkoSceneFade}
        ref={sceneRef}
        onClick={(e) => {
          // Only drop if we didn't click on the puck
          let element = e.target as HTMLElement | null;
          while (element) {
            if (element.classList.contains("plinko-puck")) {
              return;
            }
            element = element.parentElement;
          }
          dropBall();
        }}
        style={{
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
        }}
      >
        {isLoading && (
          <div className="plinko-spinner">
            <BfDsSpinner size={48} color={`rgba(${colors.blue}, 1)`} />
          </div>
        )}
        {/* Input container */}
        <div
          className="plinko-container"
          style={{
            top: 0,
            height: CONTAINERS_CONFIG.prompt.height,
            backgroundColor: CONTAINERS_CONFIG.prompt.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.prompt.borderRadius,
            border:
              `${CONTAINERS_CONFIG.prompt.borderWidth} solid ${CONTAINERS_CONFIG.prompt.borderColor}`,
          }}
        >
          <div className="sideTitle prompt">Input</div>
        </div>

        {/* Model container */}
        <div
          className="plinko-container"
          style={{
            top: CONTAINERS_CONFIG.prompt.height + GAME_CONFIG.containerGap,
            height: CONTAINERS_CONFIG.model.height,
            backgroundColor: CONTAINERS_CONFIG.model.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.model.borderRadius,
            border:
              `${CONTAINERS_CONFIG.model.borderWidth} solid ${CONTAINERS_CONFIG.model.borderColor}`,
          }}
        >
          <div className="sideTitle model">Model</div>
        </div>

        {/* Output container */}
        <div
          className="plinko-container"
          style={{
            bottom: 0,
            height: CONTAINERS_CONFIG.output.height,
            backgroundColor: CONTAINERS_CONFIG.output.backgroundColor,
            borderRadius: CONTAINERS_CONFIG.output.borderRadius,
            border:
              `${CONTAINERS_CONFIG.output.borderWidth} solid ${CONTAINERS_CONFIG.output.borderColor}`,
          }}
        >
          {/* Lines */}
          <div className="fade">
            {binsLinePositions.map((position, index) => {
              // don't render first and last line
              if (index === 0 || index === binsLinePositions.length - 1) return;
              return (
                <div
                  className="bin-separator"
                  key={index}
                  style={{
                    left: position - 2,
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
                width: middleIndex > 0
                  ? binsLinePositions[
                    middleIndex - 1
                  ] - binsLinePositions[
                    middleIndex - 2
                  ]
                  : 0,
              }}
            >
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
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
                width: middleIndex > 0
                  ? binsLinePositions[
                    middleIndex
                  ] - binsLinePositions[
                    middleIndex - 1
                  ]
                  : 0,
              }}
            >
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
            </div>
            <div
              className="starBox star3"
              style={{
                height: GAME_CONFIG.binHeight,
                left: binsLinePositions[middleIndex],
                width: middleIndex > 0
                  ? binsLinePositions[
                    middleIndex + 1
                  ] - binsLinePositions[
                    middleIndex
                  ]
                  : 0,
              }}
            >
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
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
                width: middleIndex > 0
                  ? binsLinePositions[
                    middleIndex + 2
                  ] - binsLinePositions[
                    middleIndex + 1
                  ]
                  : 0,
              }}
            >
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
            </div>
            <div
              className="starBox star1"
              style={{
                height: GAME_CONFIG.binHeight,
                left: binsLinePositions[middleIndex + 2],
                width: middleIndex > 0
                  ? binsLinePositions[
                    middleIndex + 3
                  ] - binsLinePositions[
                    middleIndex + 2
                  ]
                  : 0,
              }}
            >
              <div>
                <BfDsIcon
                  name="starSolid"
                  color="var(--bfds-primary)"
                  size="xlarge"
                />
              </div>
            </div>
          </div>
          <div className="sideTitle output">Output</div>
        </div>
        <div className="fade">
          <div
            className="plinko-puck"
            style={{
              left: `${ballStartX - GAME_CONFIG.ballSize}px`,
              width: `${GAME_CONFIG.ballSize * 2}px`,
              height: `${GAME_CONFIG.ballSize * 2}px`,
              backgroundColor: `rgba(${colors.pink}, 0.25)`,
            }}
            onMouseDown={(e) => handleDragPuck(e.nativeEvent)}
          >
            <BfDsIcon name="arrowsLeftRight" color="var(--fourtharyColor)" />
          </div>
        </div>
      </div>
    </div>
  );
}
