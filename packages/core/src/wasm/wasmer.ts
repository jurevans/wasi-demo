import {
  Wasmer,
  Runtime,
  type RuntimeOptions,
  type RunOptions,
  type PackageManifest,
  type PackageCommand,
} from "@wasmer/sdk";

/**
 * Wasm Initializers for Vite projects
 */
export async function initApp(wasmUrl: string): Promise<WebAssembly.Module> {
  return WebAssembly.compileStreaming(fetch(wasmUrl));
}

export async function wasmBytes(wasmUrl: string): Promise<Uint8Array> {
  return fetch(wasmUrl).then((res) => {
    if (!res.ok) {
      throw new Error("Could not fetch app.wasm!");
    }
    return res.bytes();
  });
}

export async function initWasmerApp(wasmUrl: string): Promise<Wasmer> {
  const bytes = await wasmBytes(wasmUrl);
  const runtimeOptions: RuntimeOptions = {
    registry: "https://webc.org/runner/wasi",
  };
  const runOptions: RunOptions = {
    program: "test",
    runtime: new Runtime(runtimeOptions),
  };
  return Wasmer.fromWasm(bytes, runOptions.runtime);
}

export async function initPackage(wasmUrl: string): Promise<Wasmer> {
  const command: PackageCommand[] = [
    {
      module: wasmUrl,
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
