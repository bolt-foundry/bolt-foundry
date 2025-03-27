import { type CSSProperties, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "packages/bfDs/components/BfDsIcon.tsx";
import { paletteForPlinko } from "packages/bfDs/const.tsx";
import { BfDsSpinner } from "packages/bfDs/components/BfDsSpinner.tsx";
import { classnames } from "lib/classnames.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

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
  ...paletteForPlinko, // pink, blue, yellow
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
  const [numBalls, setNumBalls] = useState(1);
  const [ballsInPlay, setBallsInPlay] = useState(0);
  const [fineTuned, setFineTuned] = useState(false);
  const [binsLinePositions, setBinsLinePositions] = useState<number[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

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

    let intervalId: number;
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

      // Use a Map to track peg scales
      const pegScales = new Map<Matter.Body, number>();
      const currentScale = pegScales.get(peg) || 1;
      const duration = 500;
      const startScale = currentScale;
      const endScale = scale;

      // Calculate delay based on row and column to make a wave
      const frameDelay = 2;
      const msPerFrame = 1000 / 60;
      const rowDelay = row * frameDelay * msPerFrame;
      const colDelay = col * frameDelay * msPerFrame;
      const totalDelay = rowDelay + colDelay;
      
      setTimeout(() => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease in-out cubic
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const newScale = startScale + (endScale - startScale) * easeProgress;
        const prevScale = pegScales.get(peg) || 1;
        const scaleRatio = newScale / prevScale;
        
        Matter.Body.scale(peg, scaleRatio, scaleRatio);
        pegScales.set(peg, newScale);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
      }, totalDelay);
    });
  }, [fineTuned]);

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

  const dropBall = async () => {
    if (!engineRef.current) return;

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
          render: { fillStyle: `rgba(${colors.pink}, 1)` },
        },
      );

      Matter.World.add(engineRef.current.world, ball);
      setBallsInPlay(ballsInPlay + numBalls);

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
      if (body.label?.startsWith("ball") && engineRef.current) {
        Matter.World.remove(engineRef.current.world, body);
      }
    });
    setBallsInPlay(0);
    setScore(0);
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
          kind={fineTuned ? "success" : "outlineSuccess"}
          onClick={() => {
            setNumBalls(1);
            setFineTuned(!fineTuned);
          }}
          text={fineTuned ? "Remove fine tuning" : "Add fine tuning"}
        />
        <div style={{ marginTop: 28 }}>
          <div className="plinko-stat">
            <div className="plinko-stat-header">Score</div>
            <div>{score}</div>
          </div>
          <div className="plinko-stat">
            <div className="plinko-stat-header">Pucks</div>
            <div>{ballsInPlay}</div>
          </div>
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
        className={plinkoSceneFade}
        ref={sceneRef}
        onClick={dropBall}
        style={{
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
        }}
      >
        {isLoading && (
          <div className="plinko-spinner">
            <BfDsSpinner size={48} spinnerColor={`rgba(${colors.blue}, 1)`} />
          </div>
        )}
        {/* Prompt container */}
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
          <div className="sideTitle prompt">Prompt</div>
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
          />
        </div>
      </div>
    </div>
  );
}
