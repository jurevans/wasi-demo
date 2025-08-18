use serde::{Deserialize, Serialize};
#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Clone, Serialize, Deserialize)]
pub enum MsgType {
    Request = 1,
    Response = 2,
    Exit = 3,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Serialize, Deserialize)]
pub struct Msg {
    id: String,
    msg_type: MsgType,
    payload: Vec<u8>,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Msg {
    #[cfg_attr(feature = "wasm", wasm_bindgen(constructor))]
    pub fn new(id: String, msg_type: MsgType, payload: Vec<u8>) -> Msg {
        Msg {
            id,
            msg_type,
            payload,
        }
    }

    pub fn to_json(self) -> String {
        serde_json::to_string(&self).expect("Should serialize to json")
    }

    pub fn from_json(json: &str) -> Msg {
        let msg: Msg = serde_json::from_str(json).expect("Input should be Msg!");
        msg
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn msg_type(&self) -> MsgType {
        self.msg_type.clone()
    }

    pub fn payload(&self) -> Vec<u8> {
        self.payload.clone()
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
