import type { Command, Runtime, Wasmer } from "@wasmer/sdk";
import { useWasmerSdk } from "./useWasmerSdk";
import { useState } from "react";

type LoadingPackageState =
  | { state: "loading-package" }
  | {
      state: "loaded";
      pkg: Wasmer;
      commands: Record<string, Command>;
      entrypoint?: Command;
    }
  | { state: "error"; error: unknown };

export type UseWasmerPackageState =
  | { state: "loading-sdk" }
  | { state: "sdk-error"; error: unknown }
  | LoadingPackageState;

export function useWasmerPackage(
  pkg: string | Uint8Array,
  runtime?: Runtime,
): UseWasmerPackageState {
  const sdk = useWasmerSdk();
  const [state, setState] = useState<LoadingPackageState>();

  // We can't do anything until the SDK has been loaded
  switch (sdk.state) {
    case "error":
      return { state: "sdk-error", error: sdk.error };
    case "loading":
      return { state: "loading-sdk" };
    case "loaded":
      break;
    default:
      throw new Error(`Unknown SDK state: ${sdk}`);
  }

  if (typeof state != "undefined") {
    return state;
  }

  const newState = { state: "loading-package" } as const;
  setState(newState);

  console.warn("Loading pkg", pkg, state);

  const pending =
    typeof pkg == "string"
      ? sdk.Wasmer.fromRegistry(pkg, runtime)
      : sdk.Wasmer.fromFile(pkg, runtime);

  pending
    .then((pkg) => {
      setState({
        state: "loaded",
        pkg,
        commands: pkg.commands,
        entrypoint: pkg.entrypoint,
      });
    })
    .catch((error: unknown) => setState({ state: "error", error }));

  return newState;
}
