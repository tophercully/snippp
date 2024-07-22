import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useState, useEffect } from "react";
import { formatDescription } from "../../utils/formatDescription";
import { track } from "@vercel/analytics";

interface OnboardingPopupProps {
  handleSignIn: () => void;
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ handleSignIn }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isWelcomePopupDismissed, setisWelcomePopupDismissed] = useLocalStorage(
    "isWelcomePopupDismissed",
    false,
  );

  const pages = [
    {
      title: "Hello Builders! ",
      content: `Snippp is here for you to get in, get out, get back to creating. 
        Let's get you started!`,
      imageUrl: "/snippp.svg",
    },
    {
      title: "Create and organize tools",
      content: `Add anything under 5k characters,
      Organize your snippets however you'd like :)`,
      imageUrl: "/dashboard.png",
    },
    {
      title: "Share your tools",
      content: "Easily share snippets and lists with others.",
      imageUrl: "/listpage.png",
    },
    {
      title: "Discover tools from other creators",
      content: "Someone else has probably invented that wheel.",
      imageUrl: "/search.png",
    },
    {
      title: "It's better with a profile",
      content: `-- but no pressure :) 

        You can still lurk and copy to your hearts content, we'll be around.`,
      imageUrl: "/exampleProfile.png",
    },
  ];

  useEffect(() => {
    // Automatically open popup when the component mounts
    setIsVisible(true);
  }, []);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setisWelcomePopupDismissed(true);
    track("Skip Welcome Popup");
  };

  const handleSignInWithGoogle = () => {
    handleSignIn();
    track("User Sign In from Welcome Popup");
    setIsVisible(false);
    setisWelcomePopupDismissed(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setisWelcomePopupDismissed(true);
    track("Close Welcome Popup");
  };

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
  };

  return isVisible && !isWelcomePopupDismissed ?
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-950 bg-opacity-50">
        <div className="relative flex w-11/12 max-w-md flex-col items-center overflow-hidden rounded-sm bg-base-50 shadow-md md:aspect-[4/5] md:max-w-xl">
          <button
            className="absolute right-4 top-4 z-10 border border-dashed border-base-500 p-1 px-1 text-2xl leading-none text-base-900 hover:bg-base-150 hover:text-base-700"
            onClick={handleClose}
          >
            <img
              src="/x.svg"
              className="invert"
            />
          </button>

          <div
            className="flex h-full w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((page, index) => (
              <div
                key={index}
                className="flex h-full w-full flex-shrink-0 flex-col p-6 pt-16"
              >
                <div className="flex h-full flex-grow flex-col items-start justify-around overflow-y-auto pb-12">
                  <div
                    className="mb-4 flex w-full items-center justify-center"
                    style={{ maxHeight: "66%" }}
                  >
                    <img
                      src={page.imageUrl}
                      alt="Page visual"
                      className="max-h-full max-w-full object-contain shadow-lg"
                    />
                  </div>
                  <div className="w-full">
                    <h2 className="mb-2 text-3xl font-semibold text-base-900">
                      {page.title}
                    </h2>
                    <p
                      className="text-base text-base-700"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(page.content),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-7 right-6 flex items-center justify-between">
            <div className="flex space-x-2">
              {pages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 w-2.5 cursor-pointer rounded-full ${
                    currentPage === index ? "bg-base-600" : "bg-base-400"
                  }`}
                ></div>
              ))}
            </div>

            <div className="flex gap-2 space-x-2">
              <button
                className="text-base-400 hover:text-base-500 dark:text-base-600"
                onClick={handleSkip}
              >
                Skip
              </button>
              {currentPage < pages.length - 1 ?
                <button
                  className="rounded-sm bg-base-600 px-4 py-2 text-base-50 hover:bg-base-700"
                  onClick={handleNextPage}
                >
                  Next
                </button>
              : <button
                  className="rounded-sm bg-red-500 px-4 py-2 text-lg font-bold text-base-50 hover:bg-red-600"
                  onClick={handleSignInWithGoogle}
                >
                  Sign in with Google
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    : null;
};

export default OnboardingPopup;
