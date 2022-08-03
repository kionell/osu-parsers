import {
  Score,
  ScoreInfo,
  Replay,
} from 'osu-classes';

import {
  ReplayDecoder,
  SerializationReader,
} from './Handlers';

import { readFileSync } from '../Utils/FileSystem';
import { LZMA } from '../Utils/LZMA';

/**
 * Score decoder.
 */
export class ScoreDecoder {
  /**
   * Performs score decoding from the specified .osr file.
   * @param path Path to the .osr file.
   * @param parseReplay Should replay be parsed?
   * @returns Decoded score.
   */
  async decodeFromPath(path: string, parseReplay = true): Promise<Score> {
    if (!path.endsWith('.osr')) {
      throw new Error('Wrong file format! Only .osr files are supported!');
    }

    const buffer = readFileSync(path);

    return this.decodeFromBuffer(buffer, parseReplay);
  }

  /**
   * Performs score decoding from a buffer.
   * @param buffer Buffer with score data.
   * @param parseReplay Should replay be parsed?
   * @returns Decoded score.
   */
  async decodeFromBuffer(buffer: Buffer, parseReplay = true): Promise<Score> {
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

        replay.mode = scoreInfo.rulesetId;
        replay.gameVersion = gameVersion;
        replay.hashMD5 = replayHashMD5;
        replay.frames = ReplayDecoder.decodeReplayFrames(replayData);
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
