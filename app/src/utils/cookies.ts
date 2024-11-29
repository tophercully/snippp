import {
  setCookie as setNextCookie,
  getCookie as getNextCookie,
  deleteCookie as deleteNextCookie,
} from "cookies-next";

// Set a cookie (server-side)
export const setCookie = (
  res: any,
  name: string,
  value: string,
  options: { maxAge?: number; path?: string } = {},
) => {
  setNextCookie(name, value, { req: res.req, res, ...options });
};

// Get a cookie (server-side)
export const getCookie = (req: any, name: string) => {
  return getNextCookie(name, { req });
};

// Delete a cookie (server-side)
export const deleteCookie = (res: any, name: string) => {
  deleteNextCookie(name, { req: res.req, res });
};
