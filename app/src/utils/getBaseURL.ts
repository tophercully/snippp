const getBaseURL = () => {
  const prodUrl = "https://" + process.env.NEXT_PUBLIC_VERCEL_URL;
  const devUrl = "http://localhost:3000";
  return process.env.NODE_ENV === "development" ? devUrl : prodUrl;
};
export default getBaseURL;
