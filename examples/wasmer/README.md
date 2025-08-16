# wasmer-example

This is a very simple example app, incorporating [@wasmer/sdk](https://github.com/wasmerio/wasmer-js) to execute a Rust
app compiled to `wasm32-wasip1` (Wasi). This also demonstrates basic usage of Wasmer SDK hooks from `@wasi-demo/hooks`.

```bash
# Install dependencies
npm install

# Run the project
npm run dev

# Build the wasm only
npm run build:wasm

# Build the whole project
npm run build

# Preview production build
npm run preview
```
