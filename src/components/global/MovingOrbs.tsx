import React, { useState, useEffect, useMemo } from "react";

interface Orb {
  x: number;
  y: number;
  size: number;
  gradientColors: string[];
  blurAmount: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  phaseSpeed: number;
  phase: number;
}

interface MovingOrbsProps {
  colors?: string[];
  numOrbs?: number;
  maxSizePercent?: number;
  minSizePercent?: number;
  maxBlur?: number;
  minBlur?: number;
  minOrbitSpeed?: number;
  maxOrbitSpeed?: number;
  minRotationSpeed?: number;
  maxRotationSpeed?: number;
  minPhaseSpeed?: number;
  maxPhaseSpeed?: number;
  showOnHover?: boolean;
  overflowPercent?: number;
  fadeInDuration?: number;
}

const defaultColors = ["#dc2626", "#16a34a", "#1d4ed8", "#7e22ce"];

const MovingOrbs: React.FC<MovingOrbsProps> = ({
  colors = defaultColors,
  numOrbs = 15,
  maxSizePercent = 15,
  minSizePercent = 5,
  maxBlur = 20,
  minBlur = 5,
  minOrbitSpeed = 0.0005,
  maxOrbitSpeed = 0.002,
  minRotationSpeed = 0.5,
  maxRotationSpeed = 2,
  minPhaseSpeed = 0.001,
  maxPhaseSpeed = 0.005,
  showOnHover = false,
  overflowPercent = 10,
  fadeInDuration = 0.3,
}) => {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  const gradientColors = useMemo(() => {
    return [...colors];
  }, [colors]);

  const createGradientColors = () => {
    const numStops = Math.floor(Math.random() * 3) + 1; // 2 to 4 color stops
    return Array.from(
      { length: numStops },
      () => gradientColors[Math.floor(Math.random() * gradientColors.length)],
    );
  };

  useEffect(() => {
    const createOrb = (): Orb => {
      const size =
        Math.random() * (maxSizePercent - minSizePercent) + minSizePercent;
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius =
        Math.random() * (50 - overflowPercent) + overflowPercent;

      const orbitDirection = 1; //Math.random() < 0.5 ? 1 : -1;
      const orbitSpeed =
        (Math.random() * (maxOrbitSpeed - minOrbitSpeed) + minOrbitSpeed) *
        orbitDirection;

      //   const rotationDirection = 1; //Math.random() < 0.5 ? 1 : -1;
      const rotationSpeed =
        Math.random() * (maxRotationSpeed - minRotationSpeed) +
        minRotationSpeed;

      const phaseSpeed =
        Math.random() * (maxPhaseSpeed - minPhaseSpeed) + minPhaseSpeed;

      return {
        x: 0,
        y: 0,
        size,
        gradientColors: createGradientColors(),
        blurAmount: Math.random() * (maxBlur - minBlur) + minBlur,
        angle,
        orbitRadius,
        orbitSpeed,
        rotation: 0,
        rotationSpeed,
        opacity: 1, //Math.random() * 0.5 + 0.5,
        phaseSpeed,
        phase: 0,
      };
    };

    setOrbs(Array.from({ length: numOrbs }, createOrb));
  }, [
    colors,
    numOrbs,
    maxSizePercent,
    minSizePercent,
    maxBlur,
    minBlur,
    gradientColors,
    minOrbitSpeed,
    maxOrbitSpeed,
    minRotationSpeed,
    maxRotationSpeed,
    minPhaseSpeed,
    maxPhaseSpeed,
    overflowPercent,
  ]);

  useEffect(() => {
    const moveOrbs = () => {
      setOrbs((prevOrbs) =>
        prevOrbs.map((orb) => {
          const newAngle = orb.angle + orb.orbitSpeed;
          const newX = Math.cos(newAngle) * orb.orbitRadius;
          const newY = Math.sin(newAngle) * orb.orbitRadius;
          const newRotation = orb.rotation + orb.rotationSpeed;
          const newPhase = (orb.phase + orb.phaseSpeed) % 1;

          return {
            ...orb,
            x: newX,
            y: newY,
            angle: newAngle,
            rotation: newRotation,
            phase: newPhase,
          };
        }),
      );
    };

    const intervalId = setInterval(moveOrbs, 50);
    return () => clearInterval(intervalId);
  }, []);

  const getGradient = (orb: Orb) => {
    const { gradientColors, phase } = orb;
    const numColors = gradientColors.length;
    const angle = Math.floor(phase * 360);

    return `linear-gradient(${angle}deg, ${gradientColors
      .map((color, index) => {
        const offset = (index / numColors + phase) % 1;
        return `${color} ${Math.round(offset * 100)}%`;
      })
      .join(", ")})`;
  };

  const containerClass =
    showOnHover ? "opacity-0 group-hover:opacity-100" : "opacity-100";
  const transitionStyle = `transition-opacity duration-${Math.round(fadeInDuration * 1000)}`;

  return (
    <div
      className={`absolute inset-0 z-10 overflow-visible ${containerClass} ${transitionStyle}`}
    >
      {orbs.map((orb, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `calc(50% + ${orb.x}% - ${orb.size / 2}%)`,
            top: `calc(50% + ${orb.y}% - ${orb.size / 2}%)`,
            width: `${orb.size}%`,
            paddingBottom: `${orb.size}%`,
            background: getGradient(orb),
            filter: `blur(${orb.blurAmount}px)`,
            borderRadius: "50%",
            opacity: orb.opacity,
            transform: `rotate(${orb.rotation}deg)`,
            transition: "transform 0.05s linear",
          }}
        />
      ))}
    </div>
  );
};

export default MovingOrbs;
