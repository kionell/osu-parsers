import {
  IConvertibleReplayFrame,
  LegacyReplayFrame,
  ReplayButtonState,
  ReplayFrame,
  Vector2,
} from 'osu-classes';

import { TaikoAction } from './Enums/TaikoAction';

export class TaikoReplayFrame extends ReplayFrame implements IConvertibleReplayFrame {
  /**
   * Mouse position of this replay frame.
   */
  position: Vector2 = new Vector2(0, 0);

  /**
   * Button actions of this replay frame.
   */
  actions: Set<TaikoAction> = new Set();

  fromLegacy(currentFrame: LegacyReplayFrame): this {
    if (currentFrame.mouseRight1) {
      this.actions.add(TaikoAction.LeftRim);
    }

    if (currentFrame.mouseRight2) {
      this.actions.add(TaikoAction.RightRim);
    }

    if (currentFrame.mouseLeft1) {
      this.actions.add(TaikoAction.LeftCentre);
    }

    if (currentFrame.mouseLeft2) {
      this.actions.add(TaikoAction.RightCentre);
    }

    return this;
  }

  toLegacy(): LegacyReplayFrame {
    let state = ReplayButtonState.None;

    if (this.actions.has(TaikoAction.LeftRim)) {
      state |= ReplayButtonState.Right1;
    }

    if (this.actions.has(TaikoAction.RightRim)) {
      state |= ReplayButtonState.Right2;
    }

    if (this.actions.has(TaikoAction.LeftCentre)) {
      state |= ReplayButtonState.Left1;
    }

    if (this.actions.has(TaikoAction.RightCentre)) {
      state |= ReplayButtonState.Left2;
    }

    return new LegacyReplayFrame(
      this.startTime,
      this.interval,
      this.position,
      state,
    );
  }
}
