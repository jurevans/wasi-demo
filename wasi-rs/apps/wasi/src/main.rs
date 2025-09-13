pub mod io;

use lib::interop::msg::{Msg, MsgType};

fn main() {
    loop {
        let msg: Msg = io::read_msg();

        match msg.msg_type {
            MsgType::Exit => {
                let res = Msg::new(format!("exit::{}", msg.id), MsgType::Response, None);
                io::write_json_response(&res);
                break;
            }
            _ => {
                let res = Msg::new(
                    format!("res-{}", msg.id),
                    MsgType::Response,
                    Some(msg.to_bytes()),
                );
                io::write_json_response(&res)
            }
        }
    }
}
