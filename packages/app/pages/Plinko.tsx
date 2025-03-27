import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

// Game configuration
const GAME_CONFIG = {
  width: 600,
  height: 600,
  pegRows: 6,
  pegsPerRow: 7,
  pegSpacing: 85,
  startY: 80,
  ballSize: 15,
  pegSize: 8,
  binHeight: 80,
  scoreMultiplier: 1,
};

// Calculate bins based on pegs per row
const BINS_CONFIG = {
  count: GAME_CONFIG.pegsPerRow,
  points: Array(GAME_CONFIG.pegsPerRow).fill(0).map((_, i) => {
    const mid = Math.floor(GAME_CONFIG.pegsPerRow / 2);
    const distance = Math.abs(i - mid);
    return (mid - distance + 1) * 25 * GAME_CONFIG.scoreMultiplier;
  }),
};

export function Plinko() {
  const [score, setScore] = useState(0);
  const [ballStartX, setBallStartX] = useState(GAME_CONFIG.width / 2);
  const [numBalls, setNumBalls] = useState(1);
  const [numBallsLeft, setNumBallsLeft] = useState(numBalls);
  const [dropping, setDropping] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const runnerRef = useRef<Matter.Runner>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setBallStartX(Math.max(20, Math.min(GAME_CONFIG.width - 20, x)));
  };

  useEffect(() => {
    if (numBallsLeft < numBalls) {
      setNumBallsLeft(numBalls);
    }
  }, [numBalls])

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
        background: "#f0f0f0",
      },
    });
    renderRef.current = render;

    const runner = Runner.create();
    runnerRef.current = runner;

    // Create walls
    const walls = [
      Bodies.rectangle(
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height,
        GAME_CONFIG.width,
        20,
        { isStatic: true },
      ), // bottom
      Bodies.rectangle(0, GAME_CONFIG.height / 2, 20, GAME_CONFIG.height, {
        isStatic: true,
      }), // left
      Bodies.rectangle(
        GAME_CONFIG.width,
        GAME_CONFIG.height / 2,
        20,
        GAME_CONFIG.height,
        { isStatic: true },
      ), // right
    ];

    // Create pegs
    const pegs = [];
    for (let row = 0; row < GAME_CONFIG.pegRows; row++) {
      const offset = row % 2 === 0 ? 0 : GAME_CONFIG.pegSpacing / 2;
      const numCols = GAME_CONFIG.pegsPerRow - (row % 2);
      const startX =
        (GAME_CONFIG.width - (numCols - 1) * GAME_CONFIG.pegSpacing) / 2;

      for (let col = 0; col < numCols; col++) {
        pegs.push(
          Bodies.circle(
            startX + col * GAME_CONFIG.pegSpacing,
            row * GAME_CONFIG.pegSpacing + GAME_CONFIG.startY,
            GAME_CONFIG.pegSize,
            {
              isStatic: true,
              render: { fillStyle: "#4a90e2" },
            },
          ),
        );
      }
    }

    // Add scoring bins
    const bins = [];
    const binWidth = GAME_CONFIG.width / BINS_CONFIG.count;

    for (let i = 0; i <= BINS_CONFIG.count; i++) {
      bins.push(
        Bodies.rectangle(
          i * binWidth,
          GAME_CONFIG.height - GAME_CONFIG.binHeight / 2,
          2,
          GAME_CONFIG.binHeight,
          {
            isStatic: true,
            label: `bin-${BINS_CONFIG.points[i]}`,
            render: { fillStyle: "#666" },
          },
        ),
      );
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
      const ball = Matter.Bodies.circle(ballStartX, 50, GAME_CONFIG.ballSize, {
        restitution: 0.6,
        friction: 0.05,
        density: 0.002,
        render: { fillStyle: "rgba(224, 62, 26, 1)" },
      });

      Matter.World.add(engineRef.current.world, ball);
      setNumBallsLeft(numBalls - i - 1);

      const intervalId = setInterval(() => {
        if (ball.position.y > GAME_CONFIG.height - GAME_CONFIG.binHeight) {
          const binIndex = Math.floor(
            ball.position.x / (GAME_CONFIG.width / BINS_CONFIG.count),
          );
          const points = BINS_CONFIG.points[binIndex] || 0;
          setScore((prev) => prev + points);
          clearInterval(intervalId);
          droppedBalls++;
          if (droppedBalls === numBalls) {
            setNumBallsLeft(numBalls);
          }
        }
      }, 100);

      if (i < numBalls - 1) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => setNumBalls(numBalls + 5)}>
          Add to context
        </button>
        <span>Score: {score}</span>
      </div>
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onClick={dropBall}
        style={{
          cursor: "pointer",
          position: "relative",
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${ballStartX - GAME_CONFIG.ballSize}px`,
            top: "40px",
            width: `${GAME_CONFIG.ballSize * 2}px`,
            height: `${GAME_CONFIG.ballSize * 2}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(224, 62, 26, 0.1)",
            pointerEvents: "none",
            lineHeight: "28px",
            textAlign: "center",
            color: "rgba(224, 62, 26, 1)",
            fontWeight: "bold",
          }}
        >
          {numBallsLeft}
        </div>
      </div>
    </div>
  );
}
