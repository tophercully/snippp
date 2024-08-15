import { Footer } from "./components/nav/Footer";
import { Navbar } from "./components/nav/Navbar";
import SnipppButton from "./components/SnipppButton";

import "./output.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "./hooks/UserProfile";

const Home = () => {
  document.title = `Snippp - Snippet Organizer`;
  const { userProfile, login } = useUser();
  const navigate = useNavigate();

  const SecondaryActionButton = ({
    pronounced = false,
  }: {
    pronounced?: boolean;
  }) => {
    if (userProfile) {
      return (
        <SnipppButton
          colorType="add"
          pronounced={pronounced}
          size="lg"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-md flex items-center justify-center md:text-xl">
            Go to Dashboard
            <img
              src="dashboard.svg"
              className="ml-3 h-6 group-hover:invert-0 dark:invert"
            />
          </span>
        </SnipppButton>
      );
    } else {
      return (
        <SnipppButton
          colorType="add"
          size="lg"
          pronounced={pronounced}
          onClick={() => {
            login();
            console.log("logging in");
          }}
        >
          Sign up— it's free :)
        </SnipppButton>
      );
    }
  };

  return (
    <div className="relative flex h-fit min-h-[100svh] w-[99svw] flex-col items-center justify-center gap-12 bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-16 dark:bg-base-800">
      <Navbar />
      <div className="relative flex h-[90svh] w-full flex-col justify-center">
        <div
          id="hero-spread"
          className="flex items-center justify-between gap-3"
        >
          <div
            id="hero-text"
            className="z-10 flex h-fit flex-col items-start justify-center gap-8 p-2 md:gap-16"
          >
            <h2 className="flex flex-col self-start text-7xl font-bold text-base-950 md:max-w-[66vw] md:text-9xl dark:text-base-50">
              <span className="w-fit bg-info p-1 text-white">Your</span>
              <span className="w-fit bg-info p-1 text-white">toolkit,</span>
              <span className="w-fit bg-info p-1 text-white">amplified</span>
            </h2>
            <div
              id="desc"
              className="text-md flex w-fit flex-col text-left text-black md:p-0 md:text-4xl"
            >
              <p className="mb-6 w-full max-w-[50ch] self-start text-xl md:text-3xl dark:text-white">
                Organize, share, and discover code snippets FAST, so you can
                focus on what matters —coding.
              </p>
            </div>
          </div>
          <div className="hidden h-1/2 w-2/3 flex-col items-center justify-center xl:flex">
            <img
              src="dashboardScreenshot.png"
              className="opacity-100 shadow-xl"
            />
          </div>
        </div>
        <div
          id="CTA"
          className="z-10 flex items-center gap-4 self-center md:self-end"
        >
          <SecondaryActionButton pronounced={true} />
          <SnipppButton
            onClick={() => navigate("/browse")}
            size="lg"
            colorType="neutral"
            tooltip="Browse tools from our community of developers"
            pronounced={false}
          >
            <span className="text-md relative z-10 flex flex-nowrap items-center md:text-lg dark:group-hover:text-base-50">
              Browse tools
              <img
                src="arrow-right-long.svg"
                className="relative ml-3 h-6 invert group-hover:invert-0 dark:invert-0"
              />
            </span>
          </SnipppButton>
        </div>
      </div>

      <div className="flex min-h-[70svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 p-2 text-black md:gap-16 dark:text-white">
            <h1 className="flex w-2/3 flex-col text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="w-fit bg-error p-1 text-white">Sort</span>
              <span className="w-fit bg-error p-1 text-white">smarter,</span>
              <span className="w-fit text-nowrap bg-error p-1 text-white">
                build faster
              </span>
            </h1>
            <p className="p-2 text-xl md:text-3xl">
              Create tailored lists to keep your go-to snippets within reach—
              boost your productivity and never waste time searching again.
            </p>
          </div>
          <img
            src="/listsScreenshot.png"
            className="max-w-[70vw] rounded-lg shadow-xl md:max-w-[35vw]"
          />
        </div>
      </div>

      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h1 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="z-10 w-fit bg-success p-1 text-white">
                Leverage
              </span>
              <span className="w-fit bg-success p-1 text-white">
                collective
              </span>
              <span className="w-fit bg-success p-1 text-white">knowledge</span>
            </h1>
            <p className="p-2 text-xl md:text-3xl">
              Explore a rich library of snippets from developers around the
              world or share your own with the community. Learning and
              contributing has never been easier.
            </p>
            <p className="p-2 text-xl md:text-3xl">
              At Snippp, contributors are valued, empowering new developers and
              nurturing a culture of sharing and growth.
            </p>
          </div>
          <img
            src="/profileScreenshot.png"
            className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
          />
        </div>
      </div>

      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h1 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="flex w-fit flex-wrap">
                <span className="w-fit bg-special p-1 text-white">Your</span>
                <span className="w-fit bg-special p-1 text-white">code,</span>
              </span>
              <span className="flex w-fit flex-wrap">
                <span className="z-10 w-fit bg-special p-1 text-white">
                  your
                </span>
                <span className="w-fit bg-special p-1 text-white">control</span>
              </span>
            </h1>
            <p className="p-2 text-xl md:text-3xl">
              We prioritize your privacy. Control who sees your snippets with
              customizable privacy settings, ensuring your code is safe and
              secure.
            </p>
            <p className="p-2 text-xl md:text-3xl">
              Need more security? Keep an ear out for our upcoming desktop app
              by following us on{" "}
              <a
                target="_blank"
                href="https://twitter.com/snipppio"
                className="underline"
              >
                Twitter
              </a>
              . All of the power of Snippp, without sharing your code with us.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <img
              src="/privacyScreenshot.png"
              className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
            />
            <img
              src="/privateScreenshot.png"
              className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
            />
          </div>
        </div>
      </div>
      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h1 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="w-fit bg-info p-1 text-white">Start </span>
              <span className="w-fit bg-info p-1 text-white">for </span>
              <span className="w-fit bg-info p-1 text-white">$free</span>
            </h1>
            <p className="p-2 text-xl md:text-3xl">
              Sign up now and join a growing community of developers optimizing
              their workflow with our powerful snippet organizer.
            </p>
            <div className="self-center">
              <SecondaryActionButton pronounced={true} />
            </div>
            <p className="p-2 text-xl md:text-3xl">
              Unlock advanced features and unlimited storage with our upcoming
              Pro plan.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-[95%] p-2">
        <button
          className="my-4 justify-self-end text-sm text-base-500"
          onClick={() => navigate("/stats")}
        >
          stats
        </button>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
