import { IScore } from 'osu-classes';
import { ReplayEncoder, SerializationWriter } from './Handlers';
import { mkdir, writeFile, dirname } from '../Utils/FileSystem';
import { LZMA } from '../Utils/LZMA';
import { FileFormat } from '../Enums';
import { BufferLike } from '../Utils/Buffer';

/**
 * Score encoder.
 */
export class ScoreEncoder {
  /**
   * Performs score info encoding to the specified path.
   * @param path Path for writing the .osr file.
   * @param score Score info for encoding.
   */
  async encodeToPath(path: string, score?: IScore): Promise<void> {
    if (!path.endsWith(FileFormat.Replay)) {
      path += FileFormat.Replay;
    }

    const data = await this.encodeToBuffer(score);

    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, new Uint8Array(data));
  }

  /**
   * Performs score encoding to a buffer.
   * @param score Score info for encoding.
   * @returns A buffer with encoded score & replay data.
   */
  async encodeToBuffer(score?: IScore): Promise<BufferLike> {
    if (typeof score?.info?.id !== 'number') {
      return new Uint8Array().buffer;
    }

    const writer = new SerializationWriter();

    try {
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
      writer.writeInteger((score.info.mods?.bitwise ?? Number(score.info.rawMods)) || 0);

      writer.writeString(ReplayEncoder.encodeLifeBar(score.replay?.lifeBar ?? []));

      writer.writeDate(score.info.date);

      if (score.replay) {
        const replayData = ReplayEncoder.encodeReplayFrames(score.replay.frames);
        const encodedData = await LZMA.compress(replayData);

        writer.writeInteger(encodedData.byteLength);
        writer.writeBytes(encodedData);
      }

      writer.writeLong(BigInt(score.info.id));

      return writer.finish();
    }
    catch {
      return writer.finish();
    }
  }
}
