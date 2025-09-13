import {
  Runtime,
  type RuntimeOptions,
  type RunOptions,
  Instance,
} from "@wasmer/sdk";
// @ts-ignore
import wasiAppUrl from "./wasi.wasm?url";
import type { LoadedSdkState } from "../../types";
import { wasmBytes } from "../../wasmer";

/**
 * Load and execute Counter app runtime in a Wasmer environment
 */
export async function runWasiApp(sdk: LoadedSdkState): Promise<Instance> {
  const bytes = await wasmBytes(wasiAppUrl);
  const runtimeOptions: RuntimeOptions = {};
  const runOptions: RunOptions = {
    program: "counter_app",
    runtime: new Runtime(runtimeOptions),
  };
  return await sdk.runWasix(bytes, runOptions);
}

export { wasiAppUrl as counterWasmUrl };
