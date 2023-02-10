import {
  Score,
  ScoreInfo,
  Replay,
} from 'osu-classes';

import {
  ReplayDecoder,
  SerializationReader,
} from './Handlers';

import { LZMA } from '../Utils/LZMA';
import { BufferLike, stringifyBuffer } from '../Utils/Buffer';
import { FileFormat } from '../Enums';
import { Decoder } from './Decoder';

/**
 * A score decoder.
 */
export class ScoreDecoder extends Decoder {
  /**
   * Performs score decoding from the specified .osr file.
   * @param path A path to the .osr file.
   * @param parseReplay Should replay be parsed?
   * @returns A decoded score.
   */
  async decodeFromPath(path: string, parseReplay = true): Promise<Score> {
    if (!path.endsWith(FileFormat.Replay)) {
      throw new Error(`Wrong file format! Only ${FileFormat.Replay} files are supported!`);
    }

    try {
      const data = await this._getFileBuffer(path);

      return await this.decodeFromBuffer(data, parseReplay);
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to decode a score! Reason: ${reason}`);
    }
  }

  /**
   * Performs score decoding from a buffer.
   * @param buffer The buffer with score data.
   * @param parseReplay Should replay be parsed?
   * @returns A decoded score.
   */
  async decodeFromBuffer(buffer: BufferLike, parseReplay = true): Promise<Score> {
    const reader = new SerializationReader(buffer);
    const scoreInfo = new ScoreInfo();

    let replay = null;

    try {
      scoreInfo.rulesetId = reader.readByte();

      const gameVersion = reader.readInteger();

      scoreInfo.beatmapHashMD5 = reader.readString();
      scoreInfo.username = reader.readString();

      const replayHashMD5 = reader.readString();

      scoreInfo.count300 = reader.readShort();
      scoreInfo.count100 = reader.readShort();
      scoreInfo.count50 = reader.readShort();
      scoreInfo.countGeki = reader.readShort();
      scoreInfo.countKatu = reader.readShort();
      scoreInfo.countMiss = reader.readShort();

      scoreInfo.totalScore = reader.readInteger();
      scoreInfo.maxCombo = reader.readShort();

      scoreInfo.perfect = !!reader.readByte();

      scoreInfo.rawMods = reader.readInteger();

      /**
       * Life frames (HP graph).
       */
      const lifeData = reader.readString();

      scoreInfo.date = reader.readDate();

      const replayLength = reader.readInteger();
      const compressedBytes = reader.readBytes(replayLength);

      if (parseReplay && replayLength > 0) {
        replay = new Replay();

        const replayData = await LZMA.decompress(compressedBytes);
        const replayString = stringifyBuffer(replayData);

        replay.mode = scoreInfo.rulesetId;
        replay.gameVersion = gameVersion;
        replay.hashMD5 = replayHashMD5;
        replay.frames = ReplayDecoder.decodeReplayFrames(replayString);
        replay.lifeBar = ReplayDecoder.decodeLifeBar(lifeData);
      }

      scoreInfo.id = this._parseScoreId(gameVersion, reader);

      return new Score(scoreInfo, replay);
    }
    catch {
      return new Score(scoreInfo, replay);
    }
  }

  private _parseScoreId(version: number, reader: SerializationReader): number {
    if (version >= 20140721) {
      return Number(reader.readLong());
    }

    if (version >= 20121008) {
      return reader.readInteger();
    }

    return 0;
  }
}
