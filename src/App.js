import React, { useState } from "react";
import { Router } from "@reach/router";

import "./style.scss";

import { AuthenticationRoute } from "./routes/authentication";
import { FilesRoute } from "./routes/files";
import { ReposRoute } from "./routes/repos";

export function App() {
  return (
    <Router>
      <AuthenticationRoute path="/">
        <ReposRoute path="/:owner" />
        <FilesRoute path="/:owner/:repo/*" />
      </AuthenticationRoute>
    </Router>
  );
}
