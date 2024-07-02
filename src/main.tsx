import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./App.tsx";
import "./output.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Browser } from "./pages/Browser.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Builder } from "./pages/Builder.tsx";
import { MySnippets } from "./pages/MySnippets.tsx";

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
  <GoogleOAuthProvider clientId="952724998893-fi1qnc0vkgtlht7fpabcdooliil0ua27.apps.googleusercontent.com">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
