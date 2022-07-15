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

    const data = await this.encodeToBuffer(score);

    writeFileSync(path, data);
  }

  /**
   * Performs score encoding to a buffer.
   * @param score Score info for encoding.
   * @returns A buffer with encoded score & replay data.
   */
  async encodeToBuffer(score: IScore): Promise<Buffer> {
    if (typeof score?.info?.id !== 'number') {
      return Buffer.from([]);
    }

    const writer = new SerializationWriter();

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

    writer.writeString(ReplayEncoder.encodeLifeBar(score.replay?.lifeBar ?? []));

    writer.writeDate(score.info.date);

    if (score.replay) {
      const replayData = ReplayEncoder.encodeReplayFrames(score.replay.frames);
      const encodedData = await ReplayEncoder.compressReplayFrames(replayData);

      writer.writeInteger(encodedData.length);
      writer.writeBytes(encodedData);
    }

    writer.writeLong(BigInt(score.info.id));

    return writer.finish();
  }
}
