import { LegacyReplayFrame, LifeBarFrame } from 'osu-classes';
import { Parsing } from '../../../Utils/Parsing';

export abstract class ReplayDecoder {
  static decodeLifeBar(data: string): LifeBarFrame[] {
    if (!data) return [];

    const lifeBarFrames: LifeBarFrame[] = [];
    const frames = data.split(',');

    for (let i = 0; i < frames.length; ++i) {
      if (!frames[i]) continue;

      const frameData = frames[i].split('|');

      if (frameData.length < 2) continue;

      const frame = this.handleLifeBarFrame(frameData);

      lifeBarFrames.push(frame);
    }

    return lifeBarFrames;
  }

  static handleLifeBarFrame(frameData: string[]): LifeBarFrame {
    const lifeBarFrame = new LifeBarFrame();

    lifeBarFrame.startTime = Parsing.parseInt(frameData[0]);
    lifeBarFrame.health = Parsing.parseFloat(frameData[1]);

    return lifeBarFrame;
  }

  static decodeReplayFrames(data: string): LegacyReplayFrame[] {
    if (!data) return [];

    let lastTime = 0;

    const replayFrames: LegacyReplayFrame[] = [];
    const frames = data.split(',');

    for (let i = 0; i < frames.length; ++i) {
      if (!frames[i]) continue;

      const frameData = frames[i].split('|');

      if (frameData.length < 4) continue;

      // Unused replay seed at frameData[3].
      if (frameData[0] === '-12345') continue;

      const replayFrame = this.handleReplayFrame(frameData);

      lastTime += replayFrame.interval;

      if (i < 2 && replayFrame.mouseX === 256 && replayFrame.mouseY === -500) {
        /**
         * At the start of the replay, stable places two replay frames, 
         * at time 0 and SkipBoundary - 1, respectively.
         * both frames use a position of (256, -500).
         * ignore these frames as they serve no real purpose 
         * (and can even mislead ruleset-specific handlers - see mania)
         */
        continue;
      }

      if (replayFrame.interval < 0) {
        /**
         * At some point we probably want to rewind and play back the negative-time frames
         * but for now we'll achieve equal playback to stable by skipping negative frames
         */
        continue;
      }

      replayFrame.startTime = lastTime;
      replayFrames.push(replayFrame);
    }

    return replayFrames;
  }

  static handleReplayFrame(frameData: string[]): LegacyReplayFrame {
    const replayFrame = new LegacyReplayFrame();

    replayFrame.interval = Parsing.parseFloat(frameData[0]);
    replayFrame.mouseX = Parsing.parseFloat(frameData[1], Parsing.MAX_COORDINATE_VALUE);
    replayFrame.mouseY = Parsing.parseFloat(frameData[2], Parsing.MAX_COORDINATE_VALUE);
    replayFrame.buttonState = Parsing.parseInt(frameData[3]);

    return replayFrame;
  }
}
