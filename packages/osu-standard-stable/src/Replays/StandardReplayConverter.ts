import { IReplayFrame, ReplayConverter } from 'osu-classes';
import { StandardReplayFrame } from './StandardReplayFrame';

/**
 * osu!std replay converter.
 */
export class StandardReplayConverter extends ReplayConverter {
  protected _createConvertibleReplayFrame(): StandardReplayFrame {
    return new StandardReplayFrame();
  }

  protected _isConvertedReplayFrame(frame: IReplayFrame): boolean {
    return frame instanceof StandardReplayFrame;
  }
}
