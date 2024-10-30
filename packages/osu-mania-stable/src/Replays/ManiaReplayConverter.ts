import { IReplayFrame, ReplayConverter } from 'osu-classes';
import { ManiaReplayFrame } from './ManiaReplayFrame';

/**
 * osu!mania replay converter.
 */
export class ManiaReplayConverter extends ReplayConverter {
  protected _createConvertibleReplayFrame(): ManiaReplayFrame {
    return new ManiaReplayFrame();
  }

  protected _isConvertedReplayFrame(frame: IReplayFrame): boolean {
    return frame instanceof ManiaReplayFrame;
  }
}
