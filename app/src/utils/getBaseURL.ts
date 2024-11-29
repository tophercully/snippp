const getBaseURL = () => {
  // Development environment
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Vercel deployment environments
  const vercelUrl = process.env.VERCEL_URL;
  const vercelBranchUrl = process.env.VERCEL_BRANCH_URL;

  console.log("VERCEL_URL:", vercelUrl);
  console.log("VERCEL_BRANCH_URL:", vercelBranchUrl);
  console.log("Current environment:", process.env.NODE_ENV);

  // Fallback to a known URL if both are undefined
  if (!vercelUrl && !vercelBranchUrl) {
    console.warn("No Vercel URL found. Using a default fallback.");
    return `https://${process.env.VERCEL_PROJECT_ID}.vercel.app`;
  }

  // Prioritize branch URL, then fall back to main URL
  return `https://${vercelBranchUrl || vercelUrl}`;
};

export default getBaseURL;
