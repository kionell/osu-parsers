import { IReplayFrame, ReplayConverter } from 'osu-classes';
import { CatchReplayFrame } from './CatchReplayFrame';

/**
 * osu!catch replay converter.
 */
export class CatchReplayConverter extends ReplayConverter {
  protected _createConvertibleReplayFrame(): CatchReplayFrame {
    return new CatchReplayFrame();
  }

  protected _isConvertedReplayFrame(frame: IReplayFrame): boolean {
    return frame instanceof CatchReplayFrame;
  }
}
