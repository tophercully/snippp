export const KeyboardShortcuts = () => {
  const isBrowser = window.location.pathname.includes("browse");
  return (
    <div className="fixed bottom-8 right-8 z-50 rounded-sm bg-base-950 p-4 text-base-50 shadow-lg">
      <h3 className="mb-2 font-bold">{`Keyboard Shortcuts - ${isBrowser ? "Browser" : "Dashboard/Profile"}`}</h3>
      <ul className="flex max-h-52 flex-col flex-wrap gap-x-8 gap-y-2">
        <li className="row-span-2 flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            ?
          </span>
          <span>Toggle Control Popup</span>
        </li>
        <li className="row-span-2 flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            /
          </span>
          <span>Search</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            ↑
          </span>
          <span>Selection Up</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            ↓
          </span>
          <span>Selection Down</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="flex w-fit items-center justify-center rounded-sm border-2 px-2 py-0">
              shift
            </span>

            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ↑
            </span>
          </span>
          <span>Jump To First Selection</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="flex w-fit items-center justify-center rounded-sm border-2 px-2 py-0">
              shift
            </span>

            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ↓
            </span>
          </span>
          <span>Jump To Last Selection</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            ⏎
          </span>
          <span>Copy Snippet</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            →
          </span>
          <span>
            {isBrowser ?
              "Add/Remove Favorite"
            : "Select List OR Add/Remove Favorite"}
          </span>
        </li>
        {!isBrowser && (
          <li className="flex items-center gap-3">
            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ←
            </span>
            <span>Back to Lists</span>
          </li>
        )}
        {/* <li className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ⌘
            </span>

            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ↑
            </span>
          </span>
          <span>Sort Order Ascending</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ⌘
            </span>

            <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
              ↓
            </span>
          </span>
          <span>Sort Order Descending</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            A
          </span>
          <span>Sort Alphabetically</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            T
          </span>
          <span>Sort By Time</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-8 items-center justify-center rounded-sm border-2 px-2 py-0">
            P
          </span>
          <span>Sort By Popularity</span>
        </li> */}
      </ul>
    </div>
  );
};
