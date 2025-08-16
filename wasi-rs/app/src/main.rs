use lib;
use std::io::{self, Read, Write};

fn main() -> std::io::Result<()> {
    let mut user_input = String::new();
    io::stdin().read_to_string(&mut user_input)?;
    let result = lib::add(1, 2);

    let output = format!("From wasm -> {} {}", &user_input, result);
    io::stdout().write_all(output.as_bytes())?;

    Ok(())
}
