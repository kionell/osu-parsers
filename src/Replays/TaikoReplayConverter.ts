import { IReplayFrame, ReplayConverter } from 'osu-classes';
import { TaikoReplayFrame } from './TaikoReplayFrame';

/**
 * osu!std replay converter.
 */
export class TaikoReplayConverter extends ReplayConverter {
  protected _createConvertibleReplayFrame(): TaikoReplayFrame {
    return new TaikoReplayFrame();
  }

  protected _isConvertedReplayFrame(frame: IReplayFrame): boolean {
    return frame instanceof TaikoReplayFrame;
  }
}
