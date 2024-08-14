import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./App.tsx";
import "./output.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Browser } from "./pages/Browser.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Builder } from "./pages/Builder.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Analytics } from "@vercel/analytics/react";
import { NotifProvider } from "./components/popups/NotifContext.tsx";
import { About } from "./pages/About.tsx";
import { SnippetPage } from "./pages/SnippetPage.tsx";
import { ListPage } from "./pages/ListPage.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Stats } from "./pages/Stats.tsx";
import { Roadmap } from "./pages/Roadmap.tsx";
import UITester from "./pages/UITester.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/browse/:category?",
    element: <Browser />,
  },
  {
    path: "/dashboard/:listid?",
    element: <Dashboard />,
  },
  {
    path: "/builder/:snippetId?/:forking?",
    element: <Builder />,
  },
  {
    path: "/snippet/:id",
    element: <SnippetPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/roadmap",
    element: <Roadmap />,
  },
  {
    path: "/list/:listId",
    element: <ListPage />,
  },
  {
    path: "/user/:userid/:listid?",
    element: <Profile />,
  },
  {
    path: "/stats",
    element: <Stats />,
  },
  {
    path: "/uitest",
    element: <UITester />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="673717995116-smr2d3etjmkfqt4p0ns5puq7forh2lc8.apps.googleusercontent.com">
    <React.StrictMode>
      <NotifProvider>
        <RouterProvider router={router} />
      </NotifProvider>
      <Analytics />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
