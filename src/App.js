import React, { useEffect, useState } from "react";
import { Router, Link, RouteComponentProps } from "@reach/router";

import "./style.scss";

import { GithubApi } from "./components/GithubApi";

import { FilesRoute } from "./routes/files";

export function App() {
  return (
    <GithubApi>
      <Router>
        <FilesRoute path="/:owner/:repo/:branch/*" />
      </Router>
    </GithubApi>
  );
}
