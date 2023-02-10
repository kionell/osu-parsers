export type BufferLike = ArrayBufferLike | Uint8Array;

export function concatBuffers(list: ArrayBufferLike[]): BufferLike {
  if (list.length <= 0) {
    return new Uint8Array(0).buffer;
  }

  const arrayBuffer = list.reduce((cbuf, buf, i) => {
    if (i === 0) return cbuf;

    const tmp = new Uint8Array(cbuf.byteLength + buf.byteLength);

    tmp.set(new Uint8Array(cbuf), 0);
    tmp.set(new Uint8Array(buf), cbuf.byteLength);

    return tmp.buffer;
  }, list[0]);

  return arrayBuffer;
}
