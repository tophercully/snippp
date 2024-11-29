const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Use the Vercel-provided deployment URL for preview and production
  return `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL}`;
};

export default getBaseURL;
