import type { Metadata } from "next";
import localFont from "next/font/local";
import "./output.css";
import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./src/contexts/UserContext";
import { Analytics } from "@vercel/analytics/react";
import { NotifProvider } from "./src/contexts/NotificationContext";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff",
  variable: "--font-satoshi",
  weight: "300 900",
});

export const metadata: Metadata = {
  title: "Snippp - Code Toolkit Organizer",
  description:
    "Join a community of developers building reusable code snippets and toolkits. Open Source and free to use.",
  icons: { icon: "/snippp1x1.svg" },
};

export const Head = () => (
  <head>
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9619673959926931"
      crossOrigin="anonymous"
    ></script>
  </head>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotifProvider>
      <GoogleOAuthProvider clientId="673717995116-smr2d3etjmkfqt4p0ns5puq7forh2lc8.apps.googleusercontent.com">
        <UserProvider>
          <html lang="en">
            <body className={`${satoshi.variable} antialiased`}>
              {children}
              <Analytics />
            </body>
          </html>
        </UserProvider>
      </GoogleOAuthProvider>
    </NotifProvider>
  );
}
