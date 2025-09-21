use lib::interop::msg::Msg;
use std::io::{self, Write};

pub fn flush_stdout() {
    io::stdout().flush().expect("Failed to flush STDOUT");
}

pub fn write_json_response(msg: &Msg) {
    let json = msg.to_json();
    io::stdout()
        .write_all(format!("{json}\n").as_bytes())
        .expect("Failed to write to STDOUT");

    flush_stdout()
}

pub fn read_msg() -> Msg {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read msg");
    Msg::from_json(input.trim())
}
