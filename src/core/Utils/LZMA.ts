import { decompress, compress } from 'lzma-js-simple';

export class LZMA {
  private static _lzma = getLZMAInstance();

  static async decompress(data: Buffer): Promise<string> {
    try {
      return await this._lzma.decompress(data);
    }
    catch {
      return '';
    }
  }

  static async compress(data: string): Promise<Buffer> {
    try {
      return await this._lzma.compress(data);
    }
    catch {
      return Buffer.from('');
    }
  }
}

type DecompressedData = string | ArrayLike<number> | Buffer;
type CompressedData = ArrayLike<number>;

interface LZMAInstance {
  decompress(data: CompressedData, ...args: any[]): Promise<string>;
  compress(data: DecompressedData, ...args: any[]): Promise<Buffer>;
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
          err ? rej(err) : res(Buffer.from(result).toString());
        });
      });
    },

    compress(data: DecompressedData) {
      return new Promise((res, rej) => {
        compress(data, 6, (result, err) => {
          err ? rej(err) : res(Buffer.from(result));
        });
      });
    },
  };
}
