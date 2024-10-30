import { Replay } from './Replay';
import { IReplay } from './IReplay';
import { IReplayFrame } from './IReplayFrame';
import { ReplayFrame } from './ReplayFrame';
import { IBeatmap } from '../Beatmaps';
import { LegacyReplayFrame } from './LegacyReplayFrame';
import { IConvertibleReplayFrame } from './Types';

/**
 * A replay converter.
 */
export abstract class ReplayConverter {
  /**
   * Converts any replay from one game mode to another.
   * @param original Any kind of a replay.
   * @returns The converted replay.
   */
  convertReplay(original: IReplay, beatmap?: IBeatmap): Replay {
    const converted = this.createReplay();

    converted.gameVersion = original.gameVersion;
    converted.mode = original.mode;
    converted.hashMD5 = original.hashMD5;
    converted.lifeBar = original.lifeBar;

    for (const frame of this.convertFrames(original.frames, beatmap)) {
      converted.frames.push(frame);
    }

    return converted;
  }

  createReplay(): Replay {
    return new Replay();
  }

  *convertFrames(frames: IReplayFrame[], beatmap?: IBeatmap): Generator<ReplayFrame> {
    let lastFrame: ReplayFrame | null = null;

    for (const frame of frames) {
      const convertedFrame = this._convertFrame(frame, lastFrame, beatmap);

      yield convertedFrame;

      lastFrame = convertedFrame;
    }
  }

  protected _convertFrame(
    frame: IReplayFrame,
    lastFrame: IReplayFrame | null,
    beatmap?: IBeatmap,
  ): ReplayFrame {
    if (this._isConvertedReplayFrame(frame)) {
      return frame;
    }

    const convertedFrame = this._createConvertibleReplayFrame();

    if (convertedFrame && frame instanceof LegacyReplayFrame) {
      return convertedFrame.fromLegacy(frame, lastFrame, beatmap);
    }

    throw new Error('Replay can not be converted to this ruleset!');
  }

  /**
   * @returns A new instance of convertible replay frame.
   */
  protected abstract _createConvertibleReplayFrame(): IConvertibleReplayFrame | null;

  /**
   * @param frame A replay frame.
   * @returns If replay frame is already converted to this ruleset.
   */
  protected abstract _isConvertedReplayFrame(frame: IReplayFrame): boolean;
}
