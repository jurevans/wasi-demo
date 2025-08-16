import { useContext } from "react";
import {
  WasmerSdkContext,
  type WasmerSdkState,
} from "./context/WasmerSdkContext";

export function useWasmerSdk(): WasmerSdkState {
  const ctx = useContext(WasmerSdkContext);

  if (ctx == null) {
    throw new Error(
      "Attempting to use the Wasmer SDK outside of a <WasmerSDK /> component",
    );
  }

  return ctx;
}
