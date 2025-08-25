use serde::{self, Deserialize, Serialize};
#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub enum MsgType {
    Request = 1,
    Response = 2,
    Exit = 3,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Msg {
    #[cfg_attr(feature = "wasm", wasm_bindgen(getter_with_clone))]
    pub id: String,
    pub msg_type: MsgType,
    #[cfg_attr(feature = "wasm", wasm_bindgen(getter_with_clone))]
    pub payload: Option<Vec<u8>>,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Msg {
    #[cfg_attr(feature = "wasm", wasm_bindgen(constructor))]
    pub fn new(id: String, msg_type: MsgType, payload: Option<Vec<u8>>) -> Msg {
        Msg {
            id,
            msg_type,
            payload,
        }
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(self).expect("Should serialize to json")
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        serde_json::to_vec(self).expect("asdf")
    }

    pub fn from_json(json: &str) -> Msg {
        let msg: Msg = serde_json::from_str(json).expect("Input should be Msg!");
        msg
    }

    pub fn from_bytes(bytes: &[u8]) -> Msg {
        let msg: Msg = serde_json::from_slice(bytes).expect("Input should be Msg!");
        msg
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        todo!();
    }
}
