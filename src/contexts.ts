import React from "react";
import { Client, RepoClient } from "./github";

export const ClientContext = React.createContext<Client>(
  undefined as any as Client
);

export const RepoClientContext = React.createContext<RepoClient>(
  undefined as any as RepoClient
);
