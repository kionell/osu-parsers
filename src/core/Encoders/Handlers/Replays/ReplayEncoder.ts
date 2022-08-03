import { ILifeBarFrame, IReplayFrame } from 'osu-classes';

export abstract class ReplayEncoder {
  static encodeLifeBar(frames: ILifeBarFrame[]): string {
    if (!frames.length) return '';

    return frames.map((f) => `${f.startTime}|${f.health}`).join(',');
  }

  static encodeReplayFrames(frames: IReplayFrame[]): string {
    const encoded = [];

    if (frames) {
      let lastTime = 0;

      frames.forEach((frame) => {
        /**
         * Rounding because stable could only parse integral values.
         */
        const time = Math.round(frame.startTime);

        const parsedFrame = frame as IReplayFrame;

        const encodedData = [
          time - lastTime,
          parsedFrame?.mouseX ?? 0,
          parsedFrame?.mouseY ?? 0,
          frame.buttonState,
        ];

        encoded.push(encodedData.join('|'));

        lastTime = time;
      });
    }

    encoded.push('-12345|0|0|0');

    return encoded.join(',');
  }
}
