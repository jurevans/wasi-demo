# wasi-rs

This Cargo workspace provides:

- `lib/` - Shared library with optional `wasm-bindgen` bindings
- `app/` - Wasix executable

## Setup

You will need to install the `cargo wasix` toolchain to build `app`. On Linux, make sure you have `lld` installed for linking.
