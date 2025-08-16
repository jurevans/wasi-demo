import { createContext } from "react";
import type { LoadedSdkState } from "@wasi-demo/core/src/client";

export type WasmerSdkState =
  | LoadedSdkState
  | { state: "loading" }
  | { state: "error"; error: unknown };

export const WasmerSdkContext = createContext<WasmerSdkState | null>(null);
