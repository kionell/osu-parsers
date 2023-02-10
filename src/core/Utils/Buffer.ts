export type BufferLike = ArrayBufferLike | Uint8Array;

const textDecoder = new TextDecoder();

export function concatBufferViews(list: ArrayBufferView[]): Uint8Array {
  if (list.length <= 0) {
    return new Uint8Array(0);
  }

  const bufferLength = list.reduce((len, buf) => len + buf.byteLength, 0);

  const arrayBuffer = new Uint8Array(bufferLength);

  list.reduce((offset, view) => {
    arrayBuffer.set(new Uint8Array(view.buffer), offset);

    return offset + view.byteLength;
  }, 0);

  return arrayBuffer;
}

export function stringifyBuffer(data: string | BufferLike): string {
  if (typeof data === 'string') return data;

  return textDecoder.decode(data);
}
