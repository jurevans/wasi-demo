use lib::{Msg, MsgType};
use std::io::{self, Write};
// use std::sync::mpsc;
// use std::thread;

fn main() {
    let mut msg_input = String::new();
    io::stdin()
        .read_line(&mut msg_input)
        .expect("Failed to read msg");

    let msg: Msg = Msg::from_json(&msg_input);

    let output = Msg::new(
        format!("response-for-{}", msg.id),
        MsgType::Response,
        Some(msg.to_bytes()),
    );

    io::stdout()
        .write(format!("{}\n", output.to_json()).to_string().as_bytes())
        .expect("Failed to write to STDOUT");
    io::stdout().flush().expect("Failed to flush STDOUT");

    // let (tx, rx) = mpsc::channel();

    // Msg Handler thread
    // thread::spawn(move || {
    //     loop {
    //         let mut msg_input = String::new();
    //         io::stdin()
    //             .read_line(&mut msg_input)
    //             .expect("Failed to read msg");
    //
    //         let msg: Msg = Msg::from_json(&msg_input);
    //
    //         match msg.msg_type {
    //             MsgType::Exit => {
    //                 let res = Msg::new(format!("exit::{}", msg.id), MsgType::Response, None);
    //                 tx.send(res.to_json()).expect("Failed to send message");
    //                 break;
    //             }
    //             _ => {
    //                 let res = Msg::new(
    //                     format!("res-{}", msg.id),
    //                     MsgType::Response,
    //                     Some(msg.to_bytes()),
    //                 );
    //                 tx.send(res.to_json()).expect("Failed to send message");
    //             }
    //         }
    //     }
    // });
    //
    // // Main thread (for processing output)
    // for msg in rx {
    //     io::stdout()
    //         .write(format!("{}\n", msg).to_string().as_bytes())
    //         .expect("Failed to write to STDOUT");
    //     io::stdout().flush().expect("Failed to flush STDOUT");
    // }
}
