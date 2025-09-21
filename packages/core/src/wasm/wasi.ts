import type { Instance } from "@wasmer/sdk";

export class Requester {
  constructor(private readonly callback: (data: string) => void) {}
  write(data: string) {
    this.callback(data);
  }
}

export async function connectStreams(
  instance: Instance,
  onRead: (data: string) => void,
  onErr: (data: string) => void,
): Promise<Requester> {
  const decoder = new TextDecoder();
  const writer = instance.stdin!.getWriter();
  const requester = new Requester((data: string) => {
    const bytes = new TextEncoder().encode(`${data}\r\n`);
    writer.write(bytes);
  });

  // Concatenate STDOUT stream chunks until terminated by \n
  let msg = "";

  const stdoutStream = new WritableStream({
    write(chunk) {
      const msgChunk = decoder.decode(chunk);
      msg += msgChunk;
      if (msg.slice(-1) === "\n") {
        onRead(msg.trimEnd());
        msg = "";
      }
    },
  });

  const stderrStream = new WritableStream({
    write(chunk) {
      const msg = decoder.decode(chunk);
      onErr(msg);
    },
  });
  instance.stdout!.pipeTo(stdoutStream);
  instance.stderr!.pipeTo(stderrStream);
  return requester;
}
