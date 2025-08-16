import { createContext } from "react";

export type LoadedSdkState = { state: "loaded" } & typeof import("@wasmer/sdk");

export type WasmerSdkState =
  | LoadedSdkState
  | { state: "loading" }
  | { state: "error"; error: unknown };

export const WasmerSdkContext = createContext<WasmerSdkState | null>(null);
