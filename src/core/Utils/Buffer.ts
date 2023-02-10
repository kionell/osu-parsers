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

export function stringifyBuffer(buffer: BufferLike): string {
  const view = new Uint16Array(buffer);
  const length = view.length;

  let result = '';
  let addition = Math.pow(2, 16) - 1;

  for (let i = 0; i < length; i += addition) {
    if (i + addition > length) {
      addition = length - i;
    }

    const subarray = view.subarray(i, i + addition) as ArrayLike<number> as number[];

    result += String.fromCharCode.apply(null, subarray);
  }

  return result;
}
