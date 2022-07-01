import React from "react";
import { Routes, Route } from "react-router-dom";

import "./style.scss";

import { RequireAuthentication } from "./components/RequireAuthentication";

import { FilesRoute } from "./pages/Files";
import { Home } from "./pages/Home";
import { Repos } from "./pages/Repos";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/repos"
        element={
          <RequireAuthentication>
            <Repos />
          </RequireAuthentication>
        }
      />
      <Route
        path="/repos/:owner/:repo/*"
        element={
          <RequireAuthentication>
            <FilesRoute />
          </RequireAuthentication>
        }
      />
    </Routes>
  );
}
