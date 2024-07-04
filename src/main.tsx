import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./App.tsx";
import "./output.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Browser } from "./pages/Browser.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Builder } from "./pages/Builder.tsx";
import { MySnippets } from "./pages/MySnippets.tsx";
import { Analytics } from "@vercel/analytics/react";
import { PopupProvider } from "./components/PopupContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/browse",
    element: <Browser />,
  },
  {
    path: "/mysnippets",
    element: <MySnippets />,
  },
  {
    path: "/builder",
    element: <Builder />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="673717995116-smr2d3etjmkfqt4p0ns5puq7forh2lc8.apps.googleusercontent.com">
    <React.StrictMode>
      <PopupProvider>
        <RouterProvider router={router} />
      </PopupProvider>
      <Analytics />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);