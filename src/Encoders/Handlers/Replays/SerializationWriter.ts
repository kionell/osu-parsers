export class SerializationWriter {
  /**
   * Number of written bytes.
   */
  private _bytesWritten = 0;

  /**
   * Temp buffers for writing.
   */
  private _buffers: Buffer[] = [];

  get bytesWritten(): number {
    return this._bytesWritten;
  }

  finish(): Buffer {
    return Buffer.concat(this._buffers);
  }

  writeByte(value: number): number {
    const buffer = Buffer.alloc(1);
    const bytesWritten = buffer.writeUint8(value);

    return this._update(bytesWritten, buffer);
  }

  writeBytes(value: Buffer): number {
    this._bytesWritten += value.byteLength;
    this._buffers.push(value);

    return value.byteLength;
  }

  writeShort(value: number): number {
    const buffer = Buffer.alloc(2);
    const bytesWritten = buffer.writeUInt16LE(value);

    return this._update(bytesWritten, buffer);
  }

  writeInteger(value: number): number {
    const buffer = Buffer.alloc(4);
    const bytesWritten = buffer.writeInt32LE(value);

    return this._update(bytesWritten, buffer);
  }

  writeLong(value: bigint): number {
    const buffer = Buffer.alloc(8);
    const bytesWritten = buffer.writeBigInt64LE(value);

    return this._update(bytesWritten, buffer);
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

    for (let i = 0; i < value.length; ++i) {
      bytesWritten += this.writeByte(value.charCodeAt(i));
    }

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

  private _update(bytesWritten: number, buffer: Buffer): number {
    this._bytesWritten += bytesWritten;
    this._buffers.push(buffer);

    return bytesWritten;
  }
}
