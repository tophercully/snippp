import React, { useState, useRef, useEffect } from "react";

interface RoadmapItem {
  title: string;
  description: string;
  completed: boolean;
}

interface Release {
  version: string;
  date: string;
  items: RoadmapItem[];
}

interface RoadmapDisplayProps {
  releases: Release[];
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ releases }) => {
  const [currentRelease, setCurrentRelease] = useState(releases[0].version);
  const [clickedRelease, setClickedRelease] = useState<string | null>(null);
  const releaseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const activeRelease = releases.find((release) =>
      release.items.some((item) => !item.completed),
    );
    if (activeRelease) {
      setCurrentRelease(activeRelease.version);
    }
  }, [releases]);

  const scrollToRelease = (version: string) => {
    releaseRefs.current[version]?.scrollIntoView({ behavior: "smooth" });
    setClickedRelease(version);
  };

  const getLastCompletedRelease = () => {
    for (let i = releases.length - 1; i >= 0; i--) {
      if (releases[i].items.every((item) => item.completed)) {
        return releases[i].version;
      }
    }
    return null;
  };

  const lastCompletedRelease = getLastCompletedRelease();

  return (
    <div className="max-w-[80ch] self-center text-base-950 dark:text-base-50">
      {/* Navigation menu */}
      <div className="mb-8 flex flex-col items-start gap-2">
        {releases.map((release) => {
          const isCompleted = release.items.every((item) => item.completed);
          const isCurrentlyWorkedOn = release.version === currentRelease;
          let buttonStyle =
            " border-l border-base-500 hover:bg-base-500 px-3 py-1 transition-all duration-150 hover:text-white ";

          if (isCurrentlyWorkedOn) {
            buttonStyle +=
              "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 bg-opacity-50 dark:bg-opacity-20 ";
          } else if (isCompleted) {
            buttonStyle += "text-green-600 dark:text-green-400 ";
          } else {
            buttonStyle += "text-base-600 dark:text-base-400 ";
          }

          if (clickedRelease === release.version) {
            buttonStyle += "underline ";
          }

          return (
            <button
              key={release.version}
              onClick={() => scrollToRelease(release.version)}
              className={buttonStyle}
            >
              {release.version}
              {release.version === lastCompletedRelease && " (current release)"}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {/* Timeline */}
        <div className="absolute bottom-0 left-0 top-0 ml-6 w-0.5 bg-base-300 dark:bg-base-700"></div>

        {releases.map((release, releaseIndex) => {
          const isCompleted = release.items.every((item) => item.completed);
          const isCurrentlyWorkedOn = release.version === currentRelease;

          return (
            <div
              key={release.version}
              ref={(el) => (releaseRefs.current[release.version] = el)}
              className={`mb-12 ${isCompleted ? "contrast-[90%]" : ""}`}
            >
              {/* Release version and date */}
              <div className="mb-4 flex items-center">
                <div
                  className={`z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${
                    isCurrentlyWorkedOn ? "bg-info"
                    : isCompleted ? "bg-success dark:bg-green-700"
                    : "bg-base-300 dark:bg-base-700"
                  }`}
                ></div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-base-950 dark:text-base-50">
                    {release.version}
                  </h2>
                  <p className="text-sm text-base-600 dark:text-base-400">
                    {release.date}
                  </p>
                </div>
              </div>

              {/* Release items */}
              <div className="ml-16 space-y-4">
                {release.items.map((item, itemIndex) => {
                  let statusClass, statusText;
                  if (item.completed) {
                    statusClass = "bg-success text-white ";
                    statusText = "Completed";
                  } else if (isCurrentlyWorkedOn) {
                    statusClass = "bg-special text-white  ";
                    statusText = "In Progress";
                  } else {
                    statusClass =
                      "bg-base-200 text-base-800 dark:bg-base-700 dark:text-base-200 ";
                    statusText = "Planned";
                  }

                  return (
                    <div
                      key={`${releaseIndex}-${itemIndex}`}
                      className="flex items-center rounded-sm bg-base-100 p-4 shadow-md dark:bg-base-900"
                    >
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-base-950 dark:text-base-50">
                          {item.title}
                        </h3>
                        <p className="text-sm text-base-600 dark:text-base-400">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`ml-5 text-nowrap rounded-sm px-2 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
