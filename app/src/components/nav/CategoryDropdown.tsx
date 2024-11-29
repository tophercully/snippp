"use client";
import { useState } from "react";
import Link from "next/link";
import { categories } from "@/app/src/data/categories";

const CategoryDropdown = () => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleCategoryDropdown}
        className="flex items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none dark:text-base-50 dark:hover:text-base-200"
      >
        <span className="hidden md:flex">Categories</span>
        <span className="flex md:hidden">Menu</span>
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-100 ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`absolute ${isCategoryDropdownOpen ? "" : "sr-only"} left-0 z-20 mt-2 w-64 overflow-y-auto rounded-sm bg-base-50 shadow-lg ring-1 ring-base-950 ring-opacity-5 dark:bg-base-950`}
      >
        <div className="flex flex-col items-start text-sm md:hidden">
          <Link
            href="/browse"
            className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
          >
            Browse
          </Link>
          <Link
            href="/featured"
            className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
          >
            Featured
          </Link>
          <Link
            href="/about"
            className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
          >
            About
          </Link>
        </div>
        <div className="px-4 py-2 font-bold text-base-950 dark:text-base-50">
          Languages
        </div>
        {Object.entries(categories)
          .filter(([, info]) => info.type === "language")
          .map(([key, info]) => (
            <Link
              key={key}
              href={`/browse/${key}`}
              className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
              onClick={() => {
                setIsCategoryDropdownOpen(false);
              }}
            >
              {info.name}
            </Link>
          ))}
        <div className="mt-2 px-4 py-2 font-bold text-base-950 dark:text-base-50">
          Frameworks/Libraries
        </div>
        {Object.entries(categories)
          .filter(([, info]) => info.type === "framework")
          .map(([key, info]) => (
            <Link
              key={key}
              href={`/browse/${key}`}
              className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
              onClick={() => {
                setIsCategoryDropdownOpen(false);
              }}
            >
              {info.name}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
