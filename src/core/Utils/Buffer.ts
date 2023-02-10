export type BufferLike = ArrayBufferLike | Uint8Array;
export type BufferViewLike = BufferLike | ArrayBufferView;

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
