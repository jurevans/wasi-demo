use lib::{Msg, MsgType};
use std::io::{self, Write};
use std::thread;

fn main() {
    // TODO: Bring tx/rx channel back
    // let (tx, rx) = mpsc::channel();

    // Msg Handler thread
    let handle = thread::spawn(|| {
        loop {
            let mut msg_input = String::new();
            io::stdin()
                .read_line(&mut msg_input)
                .expect("Failed to read msg");

            let msg: Msg = Msg::from_json(&msg_input);

            match msg.msg_type {
                MsgType::Exit => {
                    io::stdout()
                        .write("Exiting...".to_string().as_bytes())
                        .expect("should work");
                    break;
                }
                _ => {
                    let res_msg = Msg::new(msg.id, MsgType::Response, msg.payload);
                    let output = res_msg.to_json();
                    println!("{}", output.to_string());
                }
            }
        }
    });

    handle.join().unwrap();
}
