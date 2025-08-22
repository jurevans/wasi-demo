// @ts-ignore
import appWasmUrl from "./wasm/app.wasm?url";

// Wasmer Wasm Initializer for Vite projects
export default async function init(): Promise<WebAssembly.Module> {
  return WebAssembly.compileStreaming(fetch(appWasmUrl));
}

export { appWasmUrl as wasm };
