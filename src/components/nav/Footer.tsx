import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="mt-5 flex w-full items-end justify-between justify-self-end">
      <p className="text-sm dark:text-base-50">© 2024 Chris McCully</p>
      <p className="hidden items-end text-sm text-base-500 lg:flex">
        Press '?' to see keyboard shortcuts
      </p>
      <div className="flex gap-3">
        <Link
          to="https://github.com/tophercully/snippp"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            src="/github.png"
          ></img>
        </Link>
        <Link
          to="https://twitter.com/snipppio"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            src="/twitter.png"
          ></img>
        </Link>
        <Link
          to="https://ko-fi.com/chrismccully"
          target="_blank"
        >
          <img
            className="h-6 hover:scale-95"
            src="/kofi.png"
          ></img>
        </Link>
      </div>
    </div>
  );
};
