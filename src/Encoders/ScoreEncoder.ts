import { writeFileSync } from 'fs';
import { IScore } from 'osu-classes';
import { ReplayEncoder, SerializationWriter } from './Handlers';

/**
 * Score encoder.
 */
export class ScoreEncoder {
  /**
   * Performs score info encoding to the specified path.
   * @param path Path for writing the .osr file.
   * @param score Score info for encoding.
   */
  async encodeToPath(path: string, score: IScore): Promise<void> {
    if (!path.endsWith('.osr')) {
      path += '.osr';
    }

    const data = await this.encodeToString(score);

    writeFileSync(path, data);
  }

  /**
   * Performs score encoding to a string.
   * @param score Score info for encoding.
   * @returns A string with encoded storyboard data.
   */
  async encodeToString(score: IScore): Promise<string> {
    if (typeof score?.info?.id !== 'number') return '';

    const encoded: string[] = [];

    const writer = new SerializationWriter(Buffer.from([]));

    writer.writeByte(score.info.rulesetId);

    if (score.replay) {
      writer.writeInteger(score.replay.gameVersion);
    }

    writer.writeString(score.info.beatmapHashMD5 ?? '');
    writer.writeString(score.info.username);

    if (score.replay) {
      writer.writeString(score.replay.hashMD5);
    }

    writer.writeShort(score.info.count300);
    writer.writeShort(score.info.count100);
    writer.writeShort(score.info.count50);
    writer.writeShort(score.info.countGeki);
    writer.writeShort(score.info.countKatu);
    writer.writeShort(score.info.countMiss);

    writer.writeInteger(score.info.totalScore);
    writer.writeShort(score.info.maxCombo);

    writer.writeByte(Number(score.info.perfect));
    writer.writeInteger(score.info.mods?.bitwise ?? 0);

    /**
     * Life frames (HP graph). Not implemented.
     */
    writer.writeString('');

    writer.writeDate(score.info.date);

    if (score.replay) {
      const replayData = ReplayEncoder.encodeReplayFrames(score.replay.frames);

      writer.writeByte(replayData.length);
      writer.writeBytes(await ReplayEncoder.compressReplayFrames(replayData));
    }

    writer.writeLong(BigInt(score.info.id));

    return encoded.filter((x) => x).join('');
  }
}
