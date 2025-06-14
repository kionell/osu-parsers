import { IBeatmap, IScore } from 'osu-classes';
import { ReplayEncoder, SerializationWriter } from './Handlers';
import { mkdir, writeFile, dirname } from '../Utils/FileSystem';
import { LZMA } from '../Utils/LZMA';
import { FileFormat } from '../Enums';

/**
 * A score encoder.
 */
export class ScoreEncoder {
  /**
   * Default game version used if replay is not available.
   * It's just the last available osu!lazer version at the moment.
   */
  static DEFAULT_GAME_VERSION = 20230621;

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

      writer.writeInteger(
        score.replay?.gameVersion ?? ScoreEncoder.DEFAULT_GAME_VERSION,
      );

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

      return writer.finish();
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to encode a score: '${reason}'`);
    }
  }
}
