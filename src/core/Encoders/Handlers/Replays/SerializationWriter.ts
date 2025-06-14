import { concatBufferViews } from '../../../Utils/Buffer';
import { CompressedData, DecompressedData, LZMA } from '../../../Utils/LZMA';

export class SerializationWriter {
  /**
   * Number of written bytes.
   */
  private _bytesWritten = 0;

  /**
   * Temp buffer views for writing.
   */
  private _views: ArrayBufferView[] = [];

  get bytesWritten(): number {
    return this._bytesWritten;
  }

  finish(): Uint8Array {
    return concatBufferViews(this._views);
  }

  async compressData(data: DecompressedData): Promise<CompressedData> {
    return LZMA.compress(data);
  }

  writeByte(value: number): number {
    return this._update(1, new Uint8Array([value]));
  }

  writeBytes(value: Uint8Array): number {
    this.writeInteger(value.byteLength);

    this._bytesWritten += value.byteLength;
    this._views.push(value);

    return value.byteLength;
  }

  writeShort(value: number): number {
    return this._update(2, new Uint16Array([value]));
  }

  writeInteger(value: number): number {
    return this._update(4, new Int32Array([value]));
  }

  writeLong(value: bigint): number {
    return this._update(8, new BigInt64Array([value]));
  }

  writeDate(date: Date): number {
    // The number of .NET ticks in seconds at the unix epoch
    const epochTicks = BigInt(62135596800000);

    // The number of seconds in ticks.
    const ticks = BigInt(date.getTime());

    return this.writeLong((ticks + epochTicks) * BigInt(1e4));
  }

  writeString(value: string): number {
    if (value.length === 0) {
      return this.writeByte(0x00);
    }

    let bytesWritten = this.writeByte(0x0b);

    bytesWritten += this.writeULEB128(value.length);

    const view = new Uint8Array(value.length);

    for (let i = 0; i < value.length; ++i) {
      view[i] = value.charCodeAt(i);
      bytesWritten++;
    }

    this._update(bytesWritten, view);

    return bytesWritten;
  }

  /**
   * Write ULEB128.
   */
  writeULEB128(value: number): number {
    let byte = 0;
    let bytesWritten = 0;

    do {
      byte = value & 0x7F;
      value >>= 7;

      if (value !== 0) {
        byte |= 0x80;
      }

      bytesWritten += this.writeByte(byte);
    }
    while (value !== 0);

    return bytesWritten;
  }

  private _update(bytesWritten: number, buffer: ArrayBufferView): number {
    this._bytesWritten += bytesWritten;
    this._views.push(buffer);

    return bytesWritten;
  }
}
