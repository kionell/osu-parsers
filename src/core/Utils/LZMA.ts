import { decompress, compress } from 'lzma-js-simple-v2';
import { BufferLike } from './Buffer';

export class LZMA {
  private static _lzma = getLZMAInstance();

  static async decompress(data: CompressedData): Promise<string> {
    try {
      return await this._lzma.decompress(data);
    }
    catch {
      return '';
    }
  }

  static async compress(data: DecompressedData): Promise<BufferLike> {
    try {
      return await this._lzma.compress(data);
    }
    catch {
      return new Uint8Array([]).buffer;
    }
  }
}

type DecompressedData = string | ArrayLike<number> | BufferLike;
type CompressedData = ArrayLike<number> | BufferLike;

interface LZMAInstance {
  decompress(data: CompressedData, ...args: any[]): Promise<string>;
  compress(data: DecompressedData, ...args: any[]): Promise<BufferLike>;
}

/**
 * Adapts external LZMA package public API to the LZMAInstance interface. 
 * @returns Adapted LZMA instance.
 */
function getLZMAInstance(): LZMAInstance {
  return {
    decompress(data: CompressedData) {
      return new Promise((res, rej) => {
        decompress(data, (result, err) => {
          err ? rej(err) : res(
            typeof result === 'string'
              ? result
              : new Uint8Array(result).toString(),
          );
        });
      });
    },

    compress(data: DecompressedData) {
      return new Promise((res, rej) => {
        compress(data, 6, (result, err) => {
          err ? rej(err) : res(new Uint8Array(result));
        });
      });
    },
  };
}
