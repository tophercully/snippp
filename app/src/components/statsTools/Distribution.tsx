import { useState } from "react";

interface DistributionProps {
  data: { [key: string]: number };
  title: string;
  small?: boolean;
}

const categoryMeta = {
  js: { displayName: "JavaScript", color: "#f1e05a" },
  ts: { displayName: "TypeScript", color: "#3073C0" },
  python: { displayName: "Python", color: "#275891" },
  css: { displayName: "CSS", color: "#563d7c" },
  reactjs: { displayName: "React", color: "#61dafb" },
  reactnative: { displayName: "React Native", color: "#51b5d1" },
  p5: { displayName: "p5.js", color: "#ed225d" },
  three: { displayName: "Three.js", color: "#000000" },
  glsl: { displayName: "GLSL", color: "#5686a5" },
};

const Distribution: React.FC<DistributionProps> = ({ data, title, small }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const sortedItems = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0);

  return (
    <div className={`mb-6 ${small ? "text-xs" : ""}`}>
      <h3
        className={`mb-2 font-semibold text-base-950 dark:text-base-50 ${small ? "text-base" : "text-lg"}`}
      >
        {title}
      </h3>
      <div
        className={`flex overflow-hidden rounded-sm ${small ? "h-3" : "h-5"}`}
      >
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
              className="group relative h-2"
              title={`${
                categoryMeta[key as keyof typeof categoryMeta]?.displayName ||
                key
              }: ${value} (${percentage.toFixed(1)}%)`}
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
            className={`mb-2 flex items-center ${small ? "mr-2" : "mr-4"}`}
          >
            <div
              className={`mr-1 rounded-sm ${small ? "h-2 w-2" : "h-3 w-3"}`}
              style={{
                backgroundColor:
                  categoryMeta[key as keyof typeof categoryMeta]?.color ||
                  "#ccc",
              }}
            ></div>
            <span
              className={`font-base-950 text-sm dark:text-base-50 ${small ? "text-xs" : ""}`}
            >
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
