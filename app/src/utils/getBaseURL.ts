const getBaseURL = () => {
  const prodUrl = "https://" + process.env.VERCEL_URL;
  const devUrl = "http://localhost:3000";
  return process.env.NODE_ENV === "production" ? prodUrl : devUrl;
};
export default getBaseURL;
