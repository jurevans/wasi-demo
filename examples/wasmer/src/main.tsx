import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WasmerSdkProvider } from "@wasi-demo/hooks";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WasmerSdkProvider log="info,wasmer_wasix=debug,wasmer_js=debug">
      <App />
    </WasmerSdkProvider>
  </StrictMode>,
);
