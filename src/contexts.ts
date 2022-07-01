import React from "react";
import { Client, RepositoryClient } from "./types";

export const ClientContext = React.createContext<Client>(
  undefined as any as Client
);

export const RepositoryClientContext = React.createContext<RepositoryClient>(
  undefined as any as RepositoryClient
);
