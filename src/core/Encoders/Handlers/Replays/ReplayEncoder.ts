import {
  ILifeBarFrame,
  IReplayFrame,
  ReplayButtonState,
  LegacyReplayFrame,
  IConvertibleReplayFrame,
  IBeatmap,
} from 'osu-classes';

export abstract class ReplayEncoder {
  static encodeLifeBar(frames: ILifeBarFrame[]): string {
    if (!frames.length) return '';

    return frames.map((f) => `${f.startTime}|${f.health}`).join(',');
  }

  static encodeReplayFrames(frames: IReplayFrame[], beatmap?: IBeatmap): string {
    const encoded = [];

    if (frames) {
      let lastTime = 0;

      frames.forEach((frame) => {
        /**
         * Rounding because stable could only parse integral values.
         */
        const time = Math.round(frame.startTime);
        const legacyFrame = this._getLegacyFrame(frame, beatmap);

        const encodedData = [
          time - lastTime,
          legacyFrame?.mouseX ?? 0,
          legacyFrame?.mouseY ?? 0,
          legacyFrame?.buttonState ?? ReplayButtonState.None,
        ];

        encoded.push(encodedData.join('|'));

        lastTime = time;
      });
    }

    encoded.push('-12345|0|0|0');

    return encoded.join(',');
  }

  private static _getLegacyFrame(frame: IReplayFrame, beatmap?: IBeatmap): LegacyReplayFrame {
    if (frame instanceof LegacyReplayFrame) {
      return frame;
    }

    const convertibleFrame = frame as IReplayFrame & IConvertibleReplayFrame;

    if (convertibleFrame.toLegacy) {
      return convertibleFrame.toLegacy(beatmap);
    }

    throw new Error('Some of the replay frames can not be converted to the legacy format!');
  }
}
