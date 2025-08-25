import {
  Wasmer,
  Runtime,
  type RuntimeOptions,
  type RunOptions,
  Instance,
  type PackageManifest,
  type PackageCommand,
} from "@wasmer/sdk";
// @ts-ignore
import appWasmUrl from "./wasm/app.wasm?url";
import type { LoadedSdkState } from "./client";

/**
 * Wasm Initializers for Vite projects
 */
export async function initWasm(): Promise<WebAssembly.Module> {
  return WebAssembly.compileStreaming(fetch(appWasmUrl));
}

export async function wasmBytes(): Promise<Uint8Array> {
  return fetch(appWasmUrl).then((res) => {
    if (!res.ok) {
      throw new Error("Could not fetch app.wasm!");
    }
    return res.bytes();
  });
}

export async function initWasmerApp(): Promise<Wasmer> {
  const bytes = await wasmBytes();
  const runtimeOptions: RuntimeOptions = {
    registry: "https://webc.org/runner/wasi",
  };
  const runOptions: RunOptions = {
    program: "test",
    runtime: new Runtime(runtimeOptions),
  };
  return Wasmer.fromWasm(bytes, runOptions.runtime);
}

export async function initPackage(): Promise<Wasmer> {
  const command: PackageCommand[] = [
    {
      module: appWasmUrl,
      name: "app",
      runner: "https://webc.org/runner/wasi",
      annotations: {
        wasi: {
          env: [],
          "main-args": [],
        },
      },
    },
  ];
  const manifest: PackageManifest = {
    command,
    fs: {},
  };

  let pkg = await Wasmer.createPackage(manifest);
  return pkg;
}

export async function runWasixApp(sdk: LoadedSdkState): Promise<Instance> {
  const bytes = await wasmBytes();
  const runtimeOptions: RuntimeOptions = {};
  const runOptions: RunOptions = {
    program: "app",
    runtime: new Runtime(runtimeOptions),
  };
  return await sdk.runWasix(bytes, runOptions);
}

export { appWasmUrl as wasm };
