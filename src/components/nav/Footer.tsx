export const Footer = () => {
  return (
    <div className="mt-5 flex w-full items-end justify-between">
      <p className="text-sm dark:text-base-50">© 2024 Chris McCully</p>
      <div className="flex gap-3">
        <a
          href="https://github.com/tophercully/p5-snippets"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            src="/github.png"
          ></img>
        </a>
        <a
          href="https://twitter.com/spinkdinky"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            src="/twitter.png"
          ></img>
        </a>
        <a
          href="https://ko-fi.com/chrismccully"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95"
            src="/kofi.png"
          ></img>
        </a>
      </div>
    </div>
  );
};
