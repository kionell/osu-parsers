import { decompress, compress } from 'lzma-js-simple-v2';

export class LZMA {
  private static _lzma = getLZMAInstance();

  static async decompress(data: CompressedData): Promise<DecompressedData> {
    try {
      return await this._lzma.decompress(data);
    }
    catch {
      return '';
    }
  }

  static async compress(data: DecompressedData): Promise<CompressedData> {
    try {
      return await this._lzma.compress(data, 1);
    }
    catch {
      return new Uint8Array([]);
    }
  }
}

type DecompressedData = string | Uint8Array;
type CompressedData = Uint8Array;

interface LZMAInstance {
  decompress(data: CompressedData, ...args: any[]): Promise<DecompressedData>;
  compress(data: DecompressedData, ...args: any[]): Promise<CompressedData>;
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
        compress(data, 1, (result, err) => {
          err ? rej(err) : res(new Uint8Array(result));
        });
      });
    },
  };
}
