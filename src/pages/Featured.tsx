import StaffPickLists from "../components/curated/StaffPickLists";
import { Footer } from "../components/nav/Footer";
import { Navbar } from "../components/nav/Navbar";
import "../output.css";
const Featured = () => {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-start gap-16 bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-16 md:pt-32 dark:bg-base-900">
      <Navbar />
      <div className="flex w-full flex-col gap-8">
        <h1 className="w-fit self-start bg-special p-1 text-7xl font-bold text-white">
          Featured toolkits
        </h1>

        <p className="max-w-prose self-start text-xl text-black dark:text-white">
          Handpicked by our community and editors, these toolkits highlight the
          most useful and reusable code snippets across various programming
          languages and frameworks.{" "}
        </p>
      </div>

      <StaffPickLists />
      <Footer />
    </div>
  );
};

export default Featured;
