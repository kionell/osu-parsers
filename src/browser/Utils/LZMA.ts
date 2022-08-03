import { compress as _compress, decompress } from "lzma-js-simple";

function compress(input: string, level: number, cb: (result: Buffer) => void) {
  _compress(input, level as any, (result) => cb(Buffer.from(result)));
}

export const LZMA = () => ({ compress, decompress });
