import { nanoid } from "nanoid";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { routes } from "./config/routesConfig";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={nanoid()} path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </>
  </React.StrictMode>
);
