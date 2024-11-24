import { EventEmitter } from "events"

interface Stream {
  readable: boolean;
  writable: boolean;
}

class BaseStream extends EventEmitter implements Stream {
  readable: boolean;
  writable: boolean;

  constructor() {
    super();
    this.readable = false;
    this.writable = false;
  }
}

export class InputStream extends BaseStream {
  private buffer: string;
  private encoding: BufferEncoding;

  constructor(encoding: BufferEncoding = 'utf-8') {
    super();
    this.readable = true;
    this.writable = false;
    this.buffer = '';
    this.encoding = encoding;
  }

  push(chunk: string | Buffer): void {
    const data = Buffer.isBuffer(chunk) ? chunk.toString(this.encoding) : chunk;
    this.buffer += data;
    this.emit('data', data);
  }

  // Read from the input stream
  read(size?: number): string | null {
    if (size === undefined) {
      const data = this.buffer;
      this.buffer = '';
      return data;
    }

    if (size <= 0) return null;

    const data = this.buffer.slice(0, size);
    this.buffer = this.buffer.slice(size);
    return data;
  }

  // End the input stream
  end(): void {
    this.emit('end');
  }
}

export class OutputStream extends BaseStream {
  constructor() {
    super();
    this.readable = false;
    this.writable = true;
  }

  // Write to the output stream
  write(chunk: string | Buffer): boolean {
    const data = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
    this.emit('data', data);
    return true;
  }

  // End the output stream
  end(chunk?: string | Buffer): void {
    if (chunk) {
      this.write(chunk);
    }
    this.emit('end');
  }
}
