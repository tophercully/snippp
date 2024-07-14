import { useState } from "react";

interface DistributionProps {
  data: { [key: string]: number };
  title: string;
}

const categoryMeta = {
  js: { displayName: "JavaScript", color: "#f1e05a" },
  ts: { displayName: "TypeScript", color: "#3073C0" },
  python: { displayName: "Python", color: "#275891" },
  css: { displayName: "CSS", color: "#563d7c" },
  reactjs: { displayName: "React", color: "#61dafb" },
  reactnative: { displayName: "React Native", color: "#61dafb" },
  p5: { displayName: "p5.js", color: "#ed225d" },
  three: { displayName: "Three.js", color: "#000000" },
  glsl: { displayName: "GLSL", color: "#5686a5" },
};

const Distribution: React.FC<DistributionProps> = ({ data, title }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const sortedItems = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0);

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-semibold text-base-950 dark:text-base-50">
        {title}
      </h3>
      <div className="flex h-5 overflow-hidden rounded-sm">
        {sortedItems.map(([key, value]) => {
          const percentage = (value / total) * 100;
          return (
            <div
              key={key}
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  categoryMeta[key as keyof typeof categoryMeta]?.color ||
                  "#ccc",
              }}
              className="group relative h-full"
              onMouseEnter={() => setHoveredItem(key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {hoveredItem === key && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                  {categoryMeta[key as keyof typeof categoryMeta]
                    ?.displayName || key}
                  : {value} ({percentage.toFixed(1)}%)
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap">
        {sortedItems.map(([key, value]) => (
          <div
            key={key}
            className="mb-2 mr-4 flex items-center"
          >
            <div
              className="mr-1 h-3 w-3 rounded-sm"
              style={{
                backgroundColor:
                  categoryMeta[key as keyof typeof categoryMeta]?.color ||
                  "#ccc",
              }}
            ></div>
            <span className="font-base-950 text-sm dark:text-base-50">
              {categoryMeta[key as keyof typeof categoryMeta]?.displayName ||
                key}
              : {value} ({((value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
