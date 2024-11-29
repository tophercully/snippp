"use client"; // Ensure this hook is only used on the client side

import { useState, useEffect } from "react";

function useCookie<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip execution during SSR

    // Helper function to get a cookie
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const cookieValue = getCookie(key);
    if (cookieValue) {
      setValue(JSON.parse(cookieValue));
    }
  }, [key]);

  // Function to update the cookie
  const updateCookie = (newValue: T, options: { days?: number } = {}) => {
    if (typeof window === "undefined") return; // Skip execution during SSR

    const { days = 7 } = options;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieValue = encodeURIComponent(JSON.stringify(newValue));

    document.cookie = `${key}=${cookieValue};expires=${expires.toUTCString()};path=/`;
    setValue(newValue);
  };

  return [value, updateCookie] as const;
}

export default useCookie;
