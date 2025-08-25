// use std::sync::Arc;
use wasm_bindgen::prelude::*;
use wasmer::{Engine, Module};

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct JsRuntime {
    #[wasm_bindgen(getter_with_clone)]
    pub bytes: Vec<u8>,
}

#[wasm_bindgen]
impl JsRuntime {
    #[wasm_bindgen(constructor)]
    pub fn new(bytes: &[u8]) -> JsRuntime {
        JsRuntime {
            bytes: Vec::from(bytes),
        }
    }

    #[wasm_bindgen(js_name = "startWasmer")]
    pub fn start_wasmer(&self) {
        let engine = Engine::default();
        let _ = Module::new(&engine, &self.bytes[..]).expect("Could not load Wasm module");
    }
}
