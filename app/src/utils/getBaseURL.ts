const getBaseURL = () => {
  const prodUrl = "https://snippp.io";
  const devUrl = "http://localhost:3000";
  return process.env.NODE_ENV === "production" ? prodUrl : devUrl;
};
export default getBaseURL;
