export class SerializationWriter {
  /**
   * Data buffer for writing.
   */
  buffer: Buffer;

  /**
   * Number of written bytes.
   */
  private _bytesWritten = 0;

  get bytesWritten(): number {
    return this._bytesWritten;
  }

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  writeByte(value: number): number {
    this._bytesWritten = this.buffer.writeUint8(value, this._bytesWritten);

    return this._bytesWritten;
  }

  writeBytes(value: Buffer): number {
    this.buffer = Buffer.concat([this.buffer, value]);
    this._bytesWritten += value.byteLength;

    return this._bytesWritten;
  }

  writeShort(value: number): number {
    this._bytesWritten = this.buffer.writeUInt16LE(value, this._bytesWritten);

    return this._bytesWritten;
  }

  writeInteger(value: number): number {
    this._bytesWritten = this.buffer.writeInt32LE(value, this._bytesWritten);

    return this._bytesWritten;
  }

  writeLong(value: bigint): number {
    this._bytesWritten = this.buffer.writeBigInt64LE(value, this._bytesWritten);

    return this._bytesWritten;
  }

  writeDate(date: Date): number {
    // The number of .NET ticks in seconds at the unix epoch
    const epochTicks = BigInt(62135596800000);

    // The number of seconds in ticks.
    const ticks = BigInt(date.getTime()) * BigInt(1e4);

    this._bytesWritten = this.writeLong(ticks + epochTicks);

    return this._bytesWritten;
  }

  writeString(value: string): number {
    for (let i = 0; i < value.length; ++i) {
      this._bytesWritten = this.writeByte(value.charCodeAt(i));
    }

    this._bytesWritten = this.writeByte(0);

    return this._bytesWritten;
  }
}
