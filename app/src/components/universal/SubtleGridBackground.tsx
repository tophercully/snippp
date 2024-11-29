"use client";
import React, { useRef, useEffect, useState } from "react";

type SubtleGridBackgroundProps = {
  isScrollable?: boolean;
};

type Square = {
  opacity: number;
  phaseSpeed: number;
  isSpecial: boolean;
  specialColorIndex: number;
};

const SubtleGridBackground: React.FC<SubtleGridBackgroundProps> = ({
  isScrollable = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches); // Initialize after mounting
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const squaresRef = useRef<Square[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const squareSize = 10;

  useEffect(() => {
    const updateDimensions = () => {
      const newWidth = window.innerWidth;
      const newHeight =
        isScrollable ?
          Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
          )
        : window.innerHeight;

      setDimensions({ width: newWidth, height: newHeight });

      const columns = Math.ceil(newWidth / squareSize);
      const rows = Math.ceil(newHeight / squareSize);
      const totalSquares = columns * rows;

      if (totalSquares > squaresRef.current.length) {
        const additionalSquares = new Array(
          totalSquares - squaresRef.current.length,
        )
          .fill(null)
          .map<Square>(() => ({
            opacity: Math.random(),
            phaseSpeed: (Math.random() * 0.015 + 0.0075) * 0.5,
            isSpecial: Math.random() < 0.002,
            specialColorIndex: Math.floor(Math.random() * 4),
          }));
        squaresRef.current = [...squaresRef.current, ...additionalSquares];
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isScrollable]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const columns = Math.ceil(dimensions.width / squareSize);
    const rows = Math.ceil(dimensions.height / squareSize);

    const baseColor = isDarkMode ? [0, 0, 0] : [255, 255, 255];
    const phaseColor = isDarkMode ? [10, 10, 10] : [245, 245, 245];
    const specialColors = [
      [22, 163, 74], // success: "#16a34a"
      [220, 38, 38], // error: "#dc2626"
      [126, 34, 206], // special: "#7e22ce"
      [29, 78, 216], // info: "#1d4ed8"
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const index = i * columns + j;
          if (index >= squaresRef.current.length) continue;

          const square = squaresRef.current[index];
          const x = j * squareSize;
          const y = i * squareSize;

          if (square.isSpecial) {
            const color = specialColors[square.specialColorIndex];
            const r = Math.round(
              baseColor[0] * (1 - square.opacity) + color[0] * square.opacity,
            );
            const g = Math.round(
              baseColor[1] * (1 - square.opacity) + color[1] * square.opacity,
            );
            const b = Math.round(
              baseColor[2] * (1 - square.opacity) + color[2] * square.opacity,
            );
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          } else {
            const r = Math.round(
              baseColor[0] * (1 - square.opacity) +
                phaseColor[0] * square.opacity,
            );
            const g = Math.round(
              baseColor[1] * (1 - square.opacity) +
                phaseColor[1] * square.opacity,
            );
            const b = Math.round(
              baseColor[2] * (1 - square.opacity) +
                phaseColor[2] * square.opacity,
            );
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          }

          ctx.fillRect(x, y, squareSize - 6, squareSize - 6);

          square.opacity += square.phaseSpeed;
          if (square.opacity > 1 || square.opacity < 0) {
            square.phaseSpeed *= -1;
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [dimensions, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`blur-xs fixed inset-0 -z-10`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SubtleGridBackground;
