import RoadmapDisplay from "../components/RoadmapDisplay";
import { Footer } from "../components/nav/Footer";
import { Navbar } from "../components/nav/Navbar";

export const releases = [
  {
    version: "v0.1.0 - MVP",
    date: "Jul 10, 2024",
    items: [
      {
        title: "Initial release!",
        description:
          "Login accounts, database started, migrate snippets from my library",
        completed: true,
      },
      {
        title: "Create Interface",
        description:
          "Design and develop the main discovery browser and dashboard",
        completed: true,
      },
      {
        title: "Favorites System",
        description:
          "Save favorite snippets, popular snippets accumulate likes and your favorites are accessible in a list of favorites",
        completed: true,
      },
      {
        title: "Search and Sorting",
        description: "General searching of the database",
        completed: true,
      },
      {
        title: "Categorization",
        description:
          "Categorize based on snippet tags, browse by category in the browser",
        completed: true,
      },
      {
        title: "Private Snippets",
        description:
          "Toggle public visibility of your snippets, keep tools in the dashboard that aren't visible to anyone else",
        completed: true,
      },
      {
        title: "User Profiles",
        description: "Profiles for users with statistics and basic user info",
        completed: true,
      },
      {
        title: "Custom Lists",
        description:
          "Add snippets to a customized list for better organization!",
        completed: true,
      },
      {
        title: "Beta!",
        description:
          "Release a working version, get some feedback, start planning to make it better",
        completed: true,
      },
    ],
  },
  {
    version: "v0.2.0 - MVP+",
    date: "July 28, 2024",
    items: [
      {
        title: "Fork a Snippet!",
        description: "Fork a public snippet to make your own copy",
        completed: true,
      },
      {
        title: "Code Blocks in Descriptions",
        description:
          "Markdown style, use triple backticks (```) to start and end a code block for mini-documentation about how your snippet is used",
        completed: true,
      },
      {
        title: "Backup/Export User Data",
        description:
          "Lets users export their snippet collection to a JSON for safe backups",
        completed: true,
      },
      {
        title: "Keyboard Shortcuts",
        description:
          "Navigate the app quickly, get in and out of lists, copy, favorite, etc.",
        completed: true,
      },
      {
        title: "Improved Mobile Experience",
        description: "Improve navigation and UI for mobile",
        completed: true,
      },
      {
        title: "Language Auto-Detection",
        description:
          "The builder detects the language from the code and auto-categorized the snippet into that language, can be overridden",
        completed: true,
      },
      {
        title: "Framework Auto-Detection",
        description:
          "The builder detects the possible frameworks and suggests categories for the user",
        completed: true,
      },
      {
        title: "Privacy Overhaul",
        description:
          "Snippet Privacy is handled on the server, so none of your data reaches the app for any bad actor to take a peek",
        completed: true,
      },
      {
        title: "Welcome Flow for New User Education",
        description:
          "Let new users know what this platform is capable of so they know what to try out",
        completed: true,
      },
      {
        title: "Statistics",
        description:
          "App statistics on landing page, user statistics on profile. Stuff like language distribution, user trends, character length in all snippets, fun stuff like that.",
        completed: true,
      },
      {
        title: "Messaging Overhaul",
        description:
          "Clarify product goals, write copy to communicate that. Pivot logo and product design guidelines.",
        completed: true,
      },
      {
        title: "UI Improvements",
        description:
          "Tune landing page, menus, profile, and loading animations",
        completed: true,
      },
      {
        title: "This Roadmap",
        description: "Build this roadmap from existing project timeline",
        completed: true,
      },
    ],
  },
  {
    version: "v0.3.0 - Quality of Life Improvements",
    date: "Aug 15, 2024",
    items: [
      {
        title: "Improved Search",
        description:
          "Weighted and scored search to help you find more relevant results",
        completed: true,
      },
      {
        title: "UI cleanup",
        description:
          "Adjust components (notifications, buttons, popups) to be more consistent, improve the look of the app. Cut down on color unless it serves a purpose. Also improves text legibility.",
        completed: true,
      },
      {
        title: "Popup rework",
        description:
          "Popups should close when you click outside of them, closing a popup should not take accuracy skillchecks",
        completed: true,
      },
      {
        title: "Word wrap for display",
        description:
          "Small detail, but very long snippets should wrap to the next line, not just run off the screen. If prettier can do it, so can we.",
        completed: true,
      },
    ],
  },
  {
    version: "v0.4.0 - Curation and Moderation",
    date: "Sep 15, 2024",
    items: [
      {
        title: "Staff Picks",
        description:
          "Curated selections of user lists and snippets that are very useful and deserve a bump to the top",
        completed: true,
      },
      {
        title: "Backend Moderation Portal",
        description:
          "Moderation for marking snippets and lists as staff picks, and for the rare case action needs to be taken when a bad actor is spamming or attacking",
        completed: true,
      },
      {
        title: "List Browser",
        description:
          "A way to browse lists of snippets, not just individual snippets. This is closer to the goal of building toolkits, not just being Gist.",
        completed: false,
      },
    ],
  },
  {
    version: "v1.0.0 - Official Launch!",
    date: "Oct 2024",
    items: [
      {
        title: "Crash Course",
        description:
          "Get prompted with a dismissable crash course when you first sign up! Attempts to ensure all users are aware of useful features.",
        completed: false,
      },
      {
        title: 'Dedicated "Curated" Section',
        description:
          "Get prompted with a dismissable crash course when you first sign up! Attempts to ensure all users are aware of useful features.",
        completed: false,
      },
    ],
  },
  {
    version: "v2.0.0 and Beyond",
    date: "????",
    items: [
      {
        title: "Self-Hosted Instance",
        description:
          "A desktop application that runs offline in your file system, with the option to import a snapshot of the current database",
        completed: false,
      },
      {
        title: "Snippp+",
        description:
          "A paid plan for increased limits. Something like 100k characters instead of the 25k limit on free tier.",
        completed: false,
      },
      {
        title: "VSCode Plugin",
        description:
          "An even faster implementation of the Snippp database of tools to be ",
        completed: false,
      },
    ],
  },
];

export const Roadmap = () => {
  document.title = `Snippp - About`;

  return (
    <div className="flex h-fit min-h-[100vh] w-full flex-col gap-5 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
      <Navbar />
      <RoadmapDisplay releases={releases} />
      <Footer />
    </div>
  );
};
