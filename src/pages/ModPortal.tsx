import ModUsers from "../components/moderation/ModUsers";
import { Navbar } from "../components/nav/Navbar";

const ModPortal = () => {
  return (
    <div className="relative flex h-fit min-h-[100svh] w-[99svw] flex-col items-center justify-start gap-12 bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-16 md:pt-32 dark:bg-base-800">
      <Navbar />
      <h1 className="w-full text-2xl font-bold">Mod Portal</h1>
      <ModUsers />

      <div>
        <h2>Current staff picks and actions</h2>
      </div>
    </div>
  );
};

export default ModPortal;
