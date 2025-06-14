import {
  Score,
  ScoreInfo,
  Replay,
  IJsonableLegacyReplaySoloScoreInfo,
  LegacyReplaySoloScoreInfo,
} from 'osu-classes';

import {
  ReplayDecoder,
  SerializationReader,
} from './Handlers';

import { BufferLike } from '../Utils/Buffer';
import { FileFormat } from '../Enums';
import { Decoder } from './Decoder';
import { ScoreEncoder } from '../Encoders';

/**
 * A score decoder.
 */
export class ScoreDecoder extends Decoder {
  /**
   * Performs score decoding from the specified .osr file.
   * @param path A path to the .osr file.
   * @param parseReplay Should replay be parsed?
   * @throws If file doesn't exist or can't be decoded.
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

      throw new Error(`Failed to decode a score: '${reason}'`);
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

      scoreInfo.isLegacyScore = gameVersion < ScoreEncoder.FIRST_LAZER_VERSION;

      /**
       * Total score version gets initialised to LATEST_VERSION.
       * In the case where the incoming score has either an osu!stable or old lazer version, we need
       * to mark it with the correct version increment to trigger reprocessing to new standardised scoring.
       */
      scoreInfo.totalScoreVersion = gameVersion < 30000002 ? 30000001 : ScoreEncoder.LATEST_VERSION;

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

      const compressedReplay = reader.readBytes();

      if (parseReplay && compressedReplay.length > 0) {
        replay = new Replay();

        const rawFrameData = await reader.readCompressedData(compressedReplay);

        replay.mode = scoreInfo.rulesetId;
        replay.gameVersion = gameVersion;
        replay.hashMD5 = replayHashMD5;
        replay.frames = ReplayDecoder.decodeReplayFrames(rawFrameData);
        replay.lifeBar = ReplayDecoder.decodeLifeBar(lifeData);
      }

      if (gameVersion >= 20140721) {
        scoreInfo.id = Number(reader.readLong());
      }
      else if (gameVersion >= 20121008) {
        scoreInfo.id = reader.readInteger();
      }

      const compressedScoreInfo = gameVersion >= 30000001 ? reader.readBytes() : new Uint8Array();

      if (compressedScoreInfo.length > 0) {
        const rawSoloScoreData = await reader.readCompressedData(compressedScoreInfo);
        const jsonScore = JSON.parse(rawSoloScoreData) as IJsonableLegacyReplaySoloScoreInfo;

        const replaySoloScore = LegacyReplaySoloScoreInfo.fromJSON(jsonScore);

        scoreInfo.id = replaySoloScore.onlineId;
        scoreInfo.apiMods = replaySoloScore.mods;
        scoreInfo.statistics = replaySoloScore.statistics;
        scoreInfo.maximumStatistics = replaySoloScore.maximumStatistics;
        scoreInfo.clientVersion = replaySoloScore.clientVersion;
        scoreInfo.rank = replaySoloScore.rank;

        if (replaySoloScore.userId > 1) {
          scoreInfo.userId = replaySoloScore.userId;
        }
      }

      return new Score(scoreInfo, replay);
    }
    catch {
      return new Score(scoreInfo, null);
    }
  }
}
