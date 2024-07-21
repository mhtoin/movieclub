import { toDataString } from "./utils";

export class Writer implements EventNotifier {
  constructor(
    readonly writer: WritableStreamDefaultWriter,
    readonly encoder: TextEncoder
  ) {}

  writeMessage(
    writer: WritableStreamDefaultWriter,
    encoder: TextEncoder,
    message: Message
  ): void {
    if (message.comment) {
      void writer.write(encoder.encode(`: ${message.comment}\n`));
    }
    if (message.event) {
      void writer.write(encoder.encode(`event: ${message.event}\n`));
    }
    if (message.id) {
      void writer.write(encoder.encode(`id: ${message.id}\n`));
    }
    if (message.retry) {
      void writer.write(encoder.encode(`retry: ${message.retry}\n`));
    }
    if (message.data) {
      void writer.write(encoder.encode(toDataString(message.data)));
    }
  }

  update(message: Message, opts?: EventOptions<any>) {
    if (opts?.beforeFn) {
      opts.beforeFn(message);
    }
    this.writeMessage(this.writer, this.encoder, message);
    if (opts?.afterFn) {
      opts.afterFn(message);
    }
  }

  complete(message: Message, opts?: EventOptions<any>) {
    if (opts?.beforeFn) {
      opts.beforeFn(message);
    }
    this.writeMessage(this.writer, this.encoder, message);
    void this.writer.close();
    if (opts?.afterFn) {
      opts.afterFn(message);
    }
  }
  /*
  error(message: Message, opts?: EventOptions<any>) {
    if (opts?.beforeFn) {
      opts.beforeFn(message);
    }
    this.writeMessage(this.writer, this.encoder, message);
    if (opts?.afterFn) {
      opts.afterFn(message);
    }
    void this.writer.close();
  }

  close(message: Message, opts?: EventOptions<any>) {
    if (opts?.beforeFn) {
      opts.beforeFn(message.data);
    }
    if (opts?.afterFn) {
      opts.afterFn(message.data);
    }
    void this.writer.close();
  }*/
}

export const getEventWriter = (
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) => new Writer(writer, encoder);
