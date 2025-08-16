export type LoadedSdkState = { state: "loaded" } & typeof import("@wasmer/sdk");

export enum RequestType {
  Exit,
}

export type Msg<T = RequestType> = {
  id: string;
  type: T;
  payload?: Uint8Array;
};

export enum MsgResponseType {
  Ack,
  Ok,
  Error,
}

export type MsgResponse = Msg<MsgResponseType> & {
  status?: string;
  error?: string;
};
