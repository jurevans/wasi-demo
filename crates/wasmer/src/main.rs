use std::io::{self, Read, Write};

fn main() -> std::io::Result<()> {
    let mut user_input = String::new();
    io::stdin().read_to_string(&mut user_input)?;

    let output = format!("From wasm -> {}", &user_input);
    io::stdout().write_all(output.as_bytes())?;

    Ok(())
}
