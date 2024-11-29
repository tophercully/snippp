import Link from "next/link";
import CategoryDropdown from "./CategoryDropdown";
import ProfileDropdown from "./ProfileDropdown";

export const Navbar: React.FC = () => {
  return (
    <>
      <div className="absolute left-0 right-0 top-0 z-50 w-full rounded-b-2xl bg-opacity-10 p-2 shadow-sm backdrop-blur-sm lg:px-10">
        <div className="flex h-fit w-full items-center justify-start gap-5">
          {/* Snippp logo */}
          <Link
            href="/"
            className="group flex items-center gap-1 rounded-sm bg-base-950 p-1 text-base-50 dark:bg-base-50 dark:text-base-950"
          >
            <img
              src="/snippp1x1.svg"
              className="h-10 w-10 brightness-0 invert dark:invert-0"
            />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:px-3">
              {"Snippp"}
            </span>
          </Link>
          <div className="flex w-fit items-center justify-center md:justify-start md:gap-5">
            <Link
              href="/browse"
              className="hidden w-full items-center p-4 pl-10 text-base-950 invert-[40%] hover:cursor-pointer hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              Browse
            </Link>
            <Link
              href="/featured"
              className="hidden w-full items-center p-4 text-base-950 invert-[40%] hover:cursor-pointer hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              Featured
            </Link>
            <CategoryDropdown />
            {/* Nest category links for crawlers */}
            <div className="sr-only">
              <Link href="/browse/js">Javascript Snippets</Link>
              <Link href="/browse/ts">TypeScript Snippets</Link>
              <Link href="/browse/reactjs">React JS Snippets</Link>
              <Link href="/browse/reactnative">React Native Snippets</Link>
              <Link href="/browse/svelte">Svelte Snippets</Link>
              <Link href="/browse/vue">Vue Snippets</Link>
              <Link href="/browse/angular">Angular Snippets</Link>
              <Link href="/browse/p5">p5.js Snippets</Link>
              <Link href="/browse/css">CSS Snippets</Link>
              <Link href="/browse/three">ThreeJS Snippets</Link>
              <Link href="/browse/python">Python Snippets</Link>
              <Link href="/browse/glsl">OpenGL Snippets</Link>
            </div>
            <Link
              href="/about"
              className="ml-0 hidden items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              About
            </Link>
          </div>
          <Link
            href="/builder"
            className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
              CREATE SNIPPET
            </span>
            <img
              src="/add.svg"
              alt="plus"
              className="rounded-sm p-2"
            />
          </Link>
          <ProfileDropdown />
        </div>
      </div>
    </>
  );
};
