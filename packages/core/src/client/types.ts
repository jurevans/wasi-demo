import { MsgType } from "@wasi-demo/lib";
export type LoadedSdkState = { state: "loaded" } & typeof import("@wasmer/sdk");

export enum RequestType {
  Exit,
}

export type Msg = {
  id: string;
  msg_type: MsgType;
  payload?: Uint8Array;
};

export enum MsgResponseType {
  Ack,
  Ok,
  Error,
}

export type MsgResponse = Msg & {
  status?: string;
  error?: string;
};
