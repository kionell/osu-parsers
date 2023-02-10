export type BufferLike = ArrayBufferLike | Uint8Array;
export type BufferViewLike = BufferLike | ArrayBufferView;

const textDecoder = new TextDecoder();

export function concatBufferViews(list: BufferViewLike[]): BufferLike {
  if (list.length <= 0) {
    return new Uint8Array(0).buffer;
  }

  const bufferLength = list.reduce((len, buf) => len + buf.byteLength, 0);

  const arrayBuffer = new Uint8Array(bufferLength);

  list.reduce((offset, view) => {
    const buffer = (view as ArrayBufferView).buffer ?? view;

    arrayBuffer.set(new Uint8Array(buffer), offset);

    return offset + view.byteLength;
  }, 0);

  return arrayBuffer;
}

export function stringifyBuffer(buffer: BufferLike): string {
  return textDecoder.decode(buffer);
}
