use lib::{Msg, MsgType};
use std::io::{self, Write};
use std::sync::mpsc;
use std::thread;

fn main() -> std::io::Result<()> {
    let (tx, rx) = mpsc::channel();

    // Msg Handler thread
    thread::spawn(move || {
        loop {
            let mut msg_input = String::new();
            io::stdin()
                .read_line(&mut msg_input)
                .expect("Failed to read msg");

            let msg: Msg = Msg::from_json(&msg_input);

            match msg.msg_type() {
                MsgType::Exit => {
                    io::stdout()
                        .write("Exiting...".to_string().as_bytes())
                        .expect("should work");
                    break;
                }
                _ => {
                    let res_msg = Msg::new(msg.id(), MsgType::Response, msg.payload());
                    let output = res_msg.to_json();
                    tx.send(output).expect("Failed to send message");
                }
            }
        }
    });

    // Main thread (for processing output)
    for received_input in rx {
        println!("{}", received_input);
        io::stdout().flush().expect("Failed to flush stdout");
    }
    println!("Exiting program.");
    Ok(())
}
