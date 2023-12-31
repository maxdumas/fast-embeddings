import { StringDecoder } from "string_decoder";
import { Transform } from "node:stream";

type SplitOptions = {
  maxLength: number;
  trailing: boolean;
};

export function split(
  matcher: RegExp = /\r?\n/,
  mapper: (t: string) => string = (t) => t,
  options: SplitOptions = {
    maxLength: Infinity,
    trailing: false,
  }
) {
  const decoder = new StringDecoder();
  var soFar = "";

  function emit(stream: Transform, piece: string) {
    try {
      piece = mapper(piece);
    } catch (err) {
      return stream.emit("error", err);
    }
    if (piece) {
      stream.push(piece, "utf8");
    }
  }

  function next(stream: Transform, buffer: string) {
    const pieces = (soFar + buffer).split(matcher);
    soFar = pieces.pop() ?? "";

    if (soFar.length > options.maxLength) {
      return stream.emit("error", new Error("maximum buffer length reached"));
    }

    for (const p of pieces) {
      emit(stream, p);
    }
  }

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const d = decoder.write(chunk);
      next(this, d);
      callback();
    },
    flush(callback) {
      next(this, decoder.end());
      if (options.trailing) {
        emit(this, soFar);
      }
      callback();
    },
  });
}
