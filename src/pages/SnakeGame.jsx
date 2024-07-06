import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const head = { ...newSnake[0] };
          head.x += direction.x;
          head.y += direction.y;

          if (
            head.x < 0 ||
            head.x >= 20 ||
            head.y < 0 ||
            head.y >= 20 ||
            newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
          ) {
            setGameOver(true);
            setIsRunning(false);
            return prevSnake;
          }

          newSnake.unshift(head);

          if (head.x === food.x && head.y === food.y) {
            setFood({
              x: Math.floor(Math.random() * 20),
              y: Math.floor(Math.random() * 20),
            });
            setScore((prevScore) => prevScore + 1);
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isRunning, direction, food]);

  const handleStart = () => {
    setIsRunning(true);
    setGameOver(false);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setGameOver(false);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">Snake Game</h1>
      <p className="text-xl mb-4">Score: {score}</p>
      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        className="border border-gray-500 mb-4"
      />
      {gameOver && <p className="text-red-500 mb-4">Game Over!</p>}
      <div className="flex space-x-4">
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
};

export default SnakeGame;