import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WasmerSdkProvider } from "@wasi-demo/hooks";

const { VITE_TOKEN } = import.meta.env;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WasmerSdkProvider
      log="info,wasmer_wasix=debug,wasmer_js=debug"
      token={VITE_TOKEN}
    >
      <App />
    </WasmerSdkProvider>
  </StrictMode>,
);
