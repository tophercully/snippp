import Link from "next/link";

export const Footer = () => {
  return (
    <div className="mt-auto flex w-full items-end justify-between justify-self-end">
      <p className="text-sm dark:text-base-50">© 2024 Chris McCully</p>
      <p className="hidden items-end text-sm text-base-500 lg:flex">
        Press {`'?'`} to see keyboard shortcuts
      </p>
      <div className="flex gap-3">
        <Link
          href="https://github.com/tophercully/snippp"
          target="_blank"
          rel="nofollow"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            alt="github"
            src="/github.png"
          />
        </Link>
        <Link
          href="https://bsky.app/profile/snippp.io"
          target="_blank"
          rel="nofollow"
        >
          <img
            className="h-6 hover:scale-95 dark:brightness-200 dark:grayscale"
            alt="bluesky"
            src="/blueskyLogo.png"
          />
        </Link>
        <Link
          href="https://twitter.com/snipppio"
          target="_blank"
          rel="nofollow"
        >
          <img
            className="h-6 hover:scale-95 dark:invert"
            alt="twitter"
            src="/twitter.png"
          />
        </Link>
        <Link
          href="https://ko-fi.com/chrismccully"
          target="_blank"
          rel="nofollow"
        >
          <img
            className="aspect-auto h-6 hover:scale-95"
            alt="ko-fi"
            src="/kofi.png"
          />
        </Link>
      </div>
    </div>
  );
};
