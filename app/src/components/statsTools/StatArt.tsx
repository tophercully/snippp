import React from "react";
import generateProportions from "../../utils/generateProportions";
import { randomInt } from "../../utils/randomFunctions";

interface StatArtProps {
  icon: React.ReactNode;
}

export const clamp = (min = 0, max = 1, a: number) =>
  Math.min(max, Math.max(min, a));

const StatArt: React.FC<StatArtProps> = ({ icon }) => {
  // Generate random number of icons (3-7)
  const numIcons = randomInt(15, 50);

  // Create array of icon states
  const icons = Array.from({ length: numIcons }, () => ({
    filled: Math.random() < 0.5,
    // Random vertical position (10-90% to keep within container)
    verticalPosition: Math.floor(Math.random() * 80) + 10,
    // Random size between 75-100% of allocated width
    sizePercentage: Math.floor(Math.random() * 26) + 75,
  }));

  // Get proportions for horizontal distribution
  const proportions = generateProportions({
    count: numIcons,
    minSize: 1,
    maxSize: 25,
  });

  // Calculate cumulative positions for absolute positioning
  let currentPosition = 0;
  const iconPositions = proportions.map((proportion) => {
    const position = currentPosition;
    currentPosition += proportion;
    return { position, width: proportion };
  });

  return (
    <div className="relative h-32 w-full overflow-hidden text-base-200">
      {icons.map((iconData, index) => {
        // Calculate the icon size based on its allocated width
        const containerWidth = iconPositions[index].width;
        const iconSize = (containerWidth * iconData.sizePercentage) / 100;

        // Clone the icon element to add props
        const clonedIcon = React.cloneElement(icon as React.ReactElement, {
          className: `absolute transition-all duration-300`,
          fill: iconData.filled ? "currentColor" : "none",
          strokeWidth: clamp(Math.random() * 2, 0.5, 2),
          style: {
            left: `${iconPositions[index].position}%`,
            top: `${iconData.verticalPosition}%`,
            transform: "translate(-50%, -50%)",
            width: `${iconSize}vw`,
            height: `${iconSize}vw`, // Keep 1:1 aspect ratio
          },
        });

        return <div key={index}>{clonedIcon}</div>;
      })}
    </div>
  );
};

export default StatArt;
