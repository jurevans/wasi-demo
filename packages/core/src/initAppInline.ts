import { Wasmer } from "@wasmer/sdk";
// @ts-ignore
import appWasmUrl from "./wasm/app.wasi.wasm?url";

/**
 * Wasm Initializers for Vite projects
 */
export default async function init(): Promise<WebAssembly.Module> {
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
  return Wasmer.fromFile(bytes);
}

export { appWasmUrl as wasm };
