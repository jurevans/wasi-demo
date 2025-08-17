use lib::{Msg, MsgType};
use std::io::{self, Read, Write};

fn main() -> std::io::Result<()> {
    let mut msg_input = String::new();
    io::stdin().read_to_string(&mut msg_input)?;

    let msg: Msg = Msg::from_json(&msg_input);
    let res_msg = Msg::new(msg.id(), MsgType::Response, msg.payload());

    let output = &res_msg.to_json();
    io::stdout().write_all(output.as_bytes())?;

    Ok(())
}
