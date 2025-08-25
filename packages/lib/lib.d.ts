/* tslint:disable */
/* eslint-disable */
export enum MsgType {
  Request = 1,
  Response = 2,
  Exit = 3,
}
export class Msg {
  free(): void;
  static from_bytes(bytes: Uint8Array): Msg;
  constructor(id: string, msg_type: MsgType, payload?: Uint8Array | null);
  to_json(): string;
  to_bytes(): Uint8Array;
  static from_json(json: string): Msg;
  id: string;
  msg_type: MsgType;
  get payload(): Uint8Array | undefined;
  set payload(value: Uint8Array | null | undefined);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_get_msg_id: (a: number) => [number, number];
  readonly __wbg_get_msg_msg_type: (a: number) => number;
  readonly __wbg_get_msg_payload: (a: number) => [number, number];
  readonly __wbg_msg_free: (a: number, b: number) => void;
  readonly __wbg_set_msg_id: (a: number, b: number, c: number) => void;
  readonly __wbg_set_msg_msg_type: (a: number, b: number) => void;
  readonly __wbg_set_msg_payload: (a: number, b: number, c: number) => void;
  readonly msg_from_bytes: (a: number, b: number) => number;
  readonly msg_from_json: (a: number, b: number) => number;
  readonly msg_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly msg_to_bytes: (a: number) => [number, number];
  readonly msg_to_json: (a: number) => [number, number];
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
