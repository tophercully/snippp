const getBaseURL = () => {
  console.log("Full process.env:", JSON.stringify(process.env, null, 2));

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);

  // Development environment
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Check if the environment variable exists
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!url) {
    console.error("CRITICAL: No URL found in environment variables!");
    throw new Error("No deployment URL configured");
  }

  // Ensure https:// is prepended
  const fullUrl = url.startsWith("https://") ? url : `https://${url}`;

  console.log("Resolved URL:", fullUrl);
  return fullUrl;
};
export default getBaseURL;
