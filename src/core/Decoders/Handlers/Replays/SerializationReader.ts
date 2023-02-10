import { BufferLike } from '../../../Utils/Buffer';

export class SerializationReader {
  /**
   * Data buffer for reading.
   */
  view: DataView;

  /**
   * Number of read bytes.
   */
  private _bytesRead = 0;

  get bytesRead(): number {
    return this._bytesRead;
  }

  constructor(buffer: BufferLike) {
    this.view = new DataView(buffer);
  }

  /**
   * Remaining bytes for reading.
   */
  get remainingBytes(): number {
    return this.view.byteLength - this._bytesRead;
  }

  /**
   * Read single byte.
   */
  readByte(): number {
    return this.view.getUint8(this._bytesRead++);
  }

  /**
   * Read multiple bytes
   * @param length The number of bytes to be read.
   * @returns Sliced buffer.
   */
  readBytes(length: number): BufferLike {
    const bytes = this.view.buffer.slice(
      this._bytesRead,
      this._bytesRead + length,
    );

    this._bytesRead += length;

    return bytes;
  }

  /**
   * Read single short (uint16) value.
   */
  readShort(): number {
    const value = this.view.getUint16(this._bytesRead, true);

    this._bytesRead += 2;

    return value;
  }

  /**
   * Read single integer (int32) value.
   */
  readInteger(): number {
    const value = this.view.getInt32(this._bytesRead, true);

    this._bytesRead += 4;

    return value;
  }

  /**
   * Read single long (int64) value.
   */
  readLong(): bigint {
    const value = this.view.getBigInt64(this._bytesRead, true);

    this._bytesRead += 8;

    return value;
  }

  /**
   * Read long (int64) in a form of date.
   */
  readDate(): Date {
    // The number of .NET ticks in seconds at the unix epoch
    const epochTicks = 62135596800000;

    return new Date(Number(this.readLong() / BigInt(1e4)) - epochTicks);
  }

  /**
   * Read ULEB128.
   */
  readULEB128(): number {
    let val = 0;
    let shift = 0;
    let byte = 0;

    do {
      byte = this.readByte();
      val |= (byte & 0x7f) << shift;
      shift += 7;
    }
    while ((byte & 0x80) !== 0);

    return val;
  }

  /**
   * Read string.
   */
  readString(): string {
    // Length and string itself aren't present.
    if (this.readByte() !== 0x0b) return '';

    const length = this.readULEB128();

    return length > 0 ? this.readBytes(length).toString() : '';
  }
}
