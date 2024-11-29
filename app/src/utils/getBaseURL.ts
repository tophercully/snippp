const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Use the Vercel-provided deployment URL for preview and production
  const vercelURL = process.env.NEXT_PUBLIC_VERCEL_URL;
  return `https://${vercelURL}`;
};

export default getBaseURL;
