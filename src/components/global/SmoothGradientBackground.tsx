import React, { useRef, useEffect, useState } from "react";

type SmoothGradientBackgroundProps = {
  isScrollable?: boolean;
};

const SmoothGradientBackground: React.FC<SmoothGradientBackgroundProps> = ({
  isScrollable = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

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

    const colors =
      isDarkMode ?
        [
          { r: 10, g: 10, b: 10 }, // Very Dark Gray
          { r: 30, g: 30, b: 30 }, // Dark Gray
          { r: 50, g: 50, b: 50 }, // Medium Dark Gray
          { r: 20, g: 20, b: 20 }, // Dark Gray
        ]
      : [
          { r: 240, g: 240, b: 240 }, // Very Light Gray
          { r: 220, g: 220, b: 220 }, // Light Gray
          { r: 200, g: 200, b: 200 }, // Medium Light Gray
          { r: 230, g: 230, b: 230 }, // Light Gray
        ];

    let time = 0;
    const speed = 0.0005; // Reduced speed for more subtle movement

    const animate = () => {
      const { width, height } = dimensions;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Update color stops
      colors.forEach((color, index) => {
        const offset =
          (index / (colors.length - 1) + Math.sin(time + index * 1.5) * 0.1) %
          1;
        gradient.addColorStop(
          offset,
          `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`,
        );
      });

      // Fill background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update time
      time += speed;

      requestAnimationFrame(animate);
    };

    animate();
  }, [dimensions, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${isScrollable ? "absolute" : ""}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SmoothGradientBackground;
