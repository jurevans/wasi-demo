use std::{
    ops::{Deref, DerefMut},
    sync::Arc,
};
use wasm_bindgen::prelude::wasm_bindgen;
use wasmer::{Instance, Module, Store, Value, imports};

#[derive(Debug)]
pub struct Runtime {
    instance: Instance,
    store: Store,
}

#[derive(Clone, Debug)]
#[repr(transparent)]
#[wasm_bindgen(js_name = "Runtime")]
pub struct JsRuntime {
    rt: Arc<Runtime>,
}

#[wasm_bindgen]
impl JsRuntime {
    #[wasm_bindgen(constructor)]
    pub fn new(bytes: &[u8]) -> JsRuntime {
        let mut store = Store::default();
        let module = Module::new(&store, bytes).unwrap();
        // The module doesn't import anything, so we create an empty import object.
        let import_object = imports! {};
        let instance = Instance::new(&mut store, &module, &import_object).unwrap();

        JsRuntime {
            rt: Arc::new(Runtime { instance, store }),
        }
    }

    pub fn run(&mut self) {
        let _start = self
            .rt
            .instance
            .exports
            .get_function("_start")
            .expect("_start function not found!");
        ()
    }
}

impl Deref for JsRuntime {
    type Target = Arc<Runtime>;

    fn deref(&self) -> &Self::Target {
        &self.rt
    }
}

impl DerefMut for JsRuntime {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.rt
    }
}

impl From<Arc<Runtime>> for JsRuntime {
    fn from(rt: Arc<Runtime>) -> Self {
        JsRuntime { rt }
    }
}

impl AsRef<Arc<Runtime>> for JsRuntime {
    fn as_ref(&self) -> &Arc<Runtime> {
        self
    }
}
/// Simple example using wat
#[wasm_bindgen]
pub extern "C" fn do_add_one_in_wasmer() -> i32 {
    let module_wat = r#"
    (module
      (type $t0 (func (param i32) (result i32)))
      (func $add_one (export "add_one") (type $t0) (param $p0 i32) (result i32)
        local.get $p0
        i32.const 1
        i32.add))
    "#;
    let mut store = Store::default();
    let module = Module::new(&store, &module_wat).unwrap();
    // The module doesn't import anything, so we create an empty import object.
    let import_object = imports! {};
    let instance = Instance::new(&mut store, &module, &import_object).unwrap();

    let add_one = instance.exports.get_function("add_one").unwrap();
    let result = add_one.call(&mut store, &[Value::I32(42)]).unwrap();
    assert_eq!(result[0], Value::I32(43));

    result[0].unwrap_i32()
}
