import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsButtonGroup } from "packages/bfDs/components/BfDsButtonGroup.tsx";
import { BfDsIcon } from "packages/bfDs/components/BfDsIcon.tsx";

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
  const [fineTuned, setFineTuned] = useState(false);
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
        background: "rgba(35, 42, 49, 1)",
      },
    });
    renderRef.current = render;

    const runner = Runner.create();
    runnerRef.current = runner;

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
            render: { fillStyle: "rgba(230, 230, 235, 1)" },
          },
        ),
      );
    }

    // Create walls
    const walls = [
      Bodies.rectangle(
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height,
        GAME_CONFIG.width,
        10,
        { isStatic: true, render: { fillStyle: "rgba(230, 230, 235, 1)" } },
      ), // bottom
      Bodies.rectangle(0, GAME_CONFIG.height / 2, 10, GAME_CONFIG.height, {
        isStatic: true,
        render: { fillStyle: "rgba(230, 230, 235, 1)" },
      }), // left
      Bodies.rectangle(
        GAME_CONFIG.width,
        GAME_CONFIG.height / 2,
        10,
        GAME_CONFIG.height,
        { isStatic: true, render: { fillStyle: "rgba(230, 230, 235, 1)" } },
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
        const y = row * GAME_CONFIG.pegSpacing + GAME_CONFIG.startY;
        const peg = Bodies.circle(
          x,
          y,
          GAME_CONFIG.pegSize,
          {
            isStatic: true,
            render: { fillStyle: "rgba(34, 217, 229, 1)" },
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
            fillStyle: "rgba(248, 113, 113, 1)",
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
        <BfDsButtonGroup
          buttons={[
            <BfDsButton
              key="1"
              onMouseDown={() => setIsLeftPressed(true)}
              onMouseUp={() => setIsLeftPressed(false)}
              onMouseLeave={() => setIsLeftPressed(false)}
              text="<"
            />,
            <BfDsButton
              key="2"
              onClick={dropBall}
              text="Drop"
            />,
            <BfDsButton
              key="3"
              onMouseDown={() => setIsRightPressed(true)}
              onMouseUp={() => setIsRightPressed(false)}
              onMouseLeave={() => setIsRightPressed(false)}
              text=">"
            />,
          ]}
        />
        <BfDsButton
          kind={numBalls > 1 ? "success" : "secondary"}
          onClick={() => {
            setNumBalls(numBalls > 1 ? 1 : 10);
          }}
          text={numBalls > 1 ? "Simplify context" : "Add to context"}
        />
        <BfDsButton
          kind={fineTuned ? "success" : "secondary"}
          onClick={() => {
            setNumBalls(1);
            setFineTuned(!fineTuned);
          }}
          text={fineTuned ? "Revert fine tuning" : "Fine tune model"}
        />
        <span>Score: {score}</span>
        <BfDsButton
          kind="outlineAlert"
          iconLeft="cross"
          onClick={clearBalls}
          size="medium"
        />
      </div>
      <div
        ref={sceneRef}
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
            top: "20px",
            width: `${GAME_CONFIG.ballSize * 2}px`,
            height: `${GAME_CONFIG.ballSize * 2}px`,
            borderRadius: "50%",
            backgroundColor: "var(--alert015)",
            pointerEvents: "none",
            lineHeight: "28px",
            textAlign: "center",
            color: "var(--alert)",
            fontWeight: "bold",
          }}
        >
          {numBallsLeft}
        </div>
      </div>
    </div>
  );
}
