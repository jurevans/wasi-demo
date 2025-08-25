import { parseArgs } from "util";
import { execSync, spawnSync } from "child_process";

const argsOptions = {
  wasiSdk: {
    type: "string",
    short: "w",
  },
  threaded: {
    type: "boolean",
    short: "m",
  },
  release: {
    type: "boolean",
    short: "r",
  },
};

const { wasiSdk = "/opt/wasi-sdk", release = true } = parseArgs({
  args: process.argv.slice(2),
  options: argsOptions,
}).values;

const WASI_VERSION = 1;
const SYSROOT_PATH = `${wasiSdk}/share/wasi-sysroot`;
const INCLUDE_PATH = `${SYSROOT_PATH}/include/wasm32-wasip${WASI_VERSION}`;

/* WASI SDK */
const WASI_ENV = {
  WASI_SDK_PATH: wasiSdk,
  wASI_SYSROOT: SYSROOT_PATH,
};

const C_ENV = {
  CC: `${wasiSdk}/bin/clang --sysroot=${SYSROOT_PATH} -I${INCLUDE_PATH}`,
  CPP: `${wasiSdk}/bin/clang --sysroot=${SYSROOT_PATH}`,
  CXX: `${wasiSdk}/bin/clang++ --sysroot=${SYSROOT_PATH}`,
  CFLAGS: "",
  CPPFLAGS: "",
  CXXFLAGS: "-fno-exceptions",
};

const WORKSPACE = "wasi-rs";
// const RUSTFLAGS = "-C target-feature=+atomics,+bulk-memory,+mutable-globals";
const RUSTFLAGS = "";

const env = { ...process.env, RUSTFLAGS, ...WASI_ENV, ...C_ENV };
const crates = ["app", "lib", "runtime"];

const wasmPackBuilder = (crate) => {
  // wasm-pack packages
  const { status } = spawnSync(
    "wasm-pack",
    ["build", release ? "--release" : "", ["--target", "web"]].flat(),
    {
      stdio: "inherit",
      cwd: `./${WORKSPACE}/${crate}`,
    },
  );
  if (status !== 0) {
    process.exit(status);
  }

  const pkg = `./${WORKSPACE}/${crate}/pkg`;
  execSync(`cp ${pkg}/${crate}_bg.wasm ./packages/${crate}/`);
  execSync(`cp ${pkg}/${crate}.js ./packages/${crate}/`);
  execSync(`cp ${pkg}/${crate}.d.ts ./packages/${crate}/`);
  // TODO: Enable if you have snippets:
  // execSync(`cp -r ${pkg}/snippets ./packages/lib/`);
};

crates.forEach((crate) => {
  if (crate === "app") {
    // const target = "wasm32-wasip1";
    const target = "wasm32-wasmer-wasi";
    const CARGO_ARGS = [
      "wasix",
      "build",
      ["--target", target],
      "--no-default-features",
    ];
    if (release) {
      CARGO_ARGS.push("--release");
    } else {
      env["RUST_BACKTRACE"] = 1;
    }
    const { status } = spawnSync("cargo", CARGO_ARGS.flat(), {
      stdio: "inherit",
      cwd: `./${WORKSPACE}/${crate}`,
      env,
    });
    if (status !== 0) {
      process.exit(status);
    }
    execSync(
      `cp ./${WORKSPACE}/target/${target}/${release ? "release" : "debug"}/${crate}.wasm ./packages/core/src/wasm/`,
    );
  } else {
    wasmPackBuilder(crate);
  }
});
