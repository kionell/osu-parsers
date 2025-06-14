import { IBeatmap, IScore, LegacyReplaySoloScoreInfo } from 'osu-classes';
import { ReplayEncoder, SerializationWriter } from './Handlers';
import { mkdir, writeFile, dirname } from '../Utils/FileSystem';
import { FileFormat } from '../Enums';

/**
 * A score encoder.
 */
export class ScoreEncoder {
  /**
   * Database version in stable-compatible YYYYMMDD format.
   * Should be incremented if any changes are made to the format/usage.
   * 30000001: Appends LegacyReplaySoloScoreInfo to the end of scores.
   * 30000002: Score stored to replay calculated using the Score V2 algorithm. 
   * Legacy scores on this version are candidate to Score V1 -> V2 conversion.
   * 30000003: First version after converting legacy total score to standardised.
   * 30000004: Fixed mod multipliers during legacy score conversion. Reconvert all scores.
   * 30000005: Introduce combo exponent in the osu! gamemode. Reconvert all scores.
   * 30000006: Fix edge cases in conversion after combo exponent introduction that lead to NaNs. Reconvert all scores.
   * 30000007: Adjust osu!mania combo and accuracy portions and judgement scoring values. Reconvert all scores.
   * 30000008: Add accuracy conversion. Reconvert all scores.
   * 30000009: Fix edge cases in conversion for scores which have 0.0x mod multiplier on stable. Reconvert all scores.
   * 30000010: Fix mania score V1 conversion using score V1 accuracy rather than V2 accuracy. Reconvert all scores.
   * 30000011: Re-do catch scoring to mirror stable Score V2 as closely as feasible. Reconvert all scores.
   * 30000012: Fix incorrect total score conversion on selected beatmaps after 
   * implementing the more correct difficulty calculator method. Reconvert all scores.
   * 30000013: All local scores will use lazer definitions of ranks for consistency. Recalculates the rank of all scores.
   * 30000014: Fix edge cases in conversion for osu! scores on selected beatmaps. Reconvert all scores.
   * 30000015: Fix osu! standardised score estimation algorithm violating basic invariants. Reconvert all scores.
   * 30000016: Fix taiko standardised score estimation algorithm not including 
   * swell tick score gain into bonus portion. Reconvert all scores.
   */
  static LATEST_VERSION = 30000016;

  /**
   * Default game version used if replay is not available.
   * It's just the last available osu!lazer version at the moment.
   * @deprecated Use {@link LATEST_VERSION} instead.
   */
  static DEFAULT_GAME_VERSION = ScoreEncoder.LATEST_VERSION;

  /**
   * The first stable-compatible YYYYMMDD format version given to lazer usage of replays.
   */
  static FIRST_LAZER_VERSION = 30000000;

  /**
   * Performs score & replay encoding to the specified path.
   * @param path The path for writing the .osr file.
   * @param score The score for encoding.
   * @param beatmap The beatmap of the replay.
   * It is required if replay contains non-legacy frames.
   * @throws If score can't be encoded
   * @throws If beatmap wasn't provided for non-legacy replay.
   * @throws If score can't be encoded or file can't be written.
   */
  async encodeToPath(path: string, score?: IScore, beatmap?: IBeatmap): Promise<void> {
    if (!path.endsWith(FileFormat.Replay)) {
      path += FileFormat.Replay;
    }

    const data = await this.encodeToBuffer(score, beatmap);

    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, new Uint8Array(data));
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to encode a score: ${reason}`);
    }
  }

  /**
   * Performs score encoding to a buffer.
   * @param score The score for encoding.
   * @param beatmap The beatmap of the replay.
   * It is required if replay contains non-legacy frames.
   * @throws If beatmap wasn't provided for non-legacy replay.
   * @returns The buffer with encoded score & replay data.
   */
  async encodeToBuffer(score?: IScore, beatmap?: IBeatmap): Promise<Uint8Array> {
    if (typeof score?.info?.id !== 'number') {
      return new Uint8Array();
    }

    const writer = new SerializationWriter();

    try {
      writer.writeByte(score.info.rulesetId);

      // Always force latest version when encoding a replay.
      writer.writeInteger(ScoreEncoder.LATEST_VERSION);

      writer.writeString(score.info.beatmapHashMD5 ?? '');
      writer.writeString(score.info.username);

      writer.writeString(score.replay?.hashMD5 ?? '');

      writer.writeShort(score.info.count300);
      writer.writeShort(score.info.count100);
      writer.writeShort(score.info.count50);
      writer.writeShort(score.info.countGeki);
      writer.writeShort(score.info.countKatu);
      writer.writeShort(score.info.countMiss);

      writer.writeInteger(score.info.totalScore);
      writer.writeShort(score.info.maxCombo);

      writer.writeByte(Number(score.info.perfect));
      writer.writeInteger(
        (score.info.mods?.bitwise ?? Number(score.info.rawMods)) || 0,
      );

      writer.writeString(
        ReplayEncoder.encodeLifeBar(score.replay?.lifeBar ?? []),
      );

      writer.writeDate(score.info.date);

      if (score.replay) {
        const replayData = ReplayEncoder.encodeReplayFrames(
          score.replay.frames,
          beatmap,
        );

        writer.writeBytes(await writer.compressData(replayData));
      }
      else {
        writer.writeInteger(0);
      }

      writer.writeLong(BigInt(score.info.id));

      const jsonScore = JSON.stringify(LegacyReplaySoloScoreInfo.fromScore(score.info));

      writer.writeBytes(await writer.compressData(jsonScore));

      return writer.finish();
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to encode a score: '${reason}'`);
    }
  }
}
