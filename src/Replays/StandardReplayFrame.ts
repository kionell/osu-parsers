import {
  IConvertibleReplayFrame,
  LegacyReplayFrame,
  ReplayButtonState,
  ReplayFrame,
  Vector2,
} from 'osu-classes';

import { StandardAction } from './Enums/StandardAction';

export class StandardReplayFrame extends ReplayFrame implements IConvertibleReplayFrame {
  /**
   * Mouse position of this replay frame.
   */
  position: Vector2 = new Vector2(0, 0);

  /**
   * Button actions of this replay frame.
   */
  actions: Set<StandardAction> = new Set();

  fromLegacy(currentFrame: LegacyReplayFrame): this {
    this.position = currentFrame.position;

    if (currentFrame.mouseLeft) {
      this.actions.add(StandardAction.LeftButton);
    }

    if (currentFrame.mouseRight) {
      this.actions.add(StandardAction.RightButton);
    }

    if (currentFrame.smoke) {
      this.actions.add(StandardAction.Smoke);
    }

    return this;
  }

  toLegacy(): LegacyReplayFrame {
    let state = ReplayButtonState.None;

    if (this.actions.has(StandardAction.LeftButton)) {
      state |= ReplayButtonState.Left1;
    }

    if (this.actions.has(StandardAction.RightButton)) {
      state |= ReplayButtonState.Right1;
    }

    if (this.actions.has(StandardAction.Smoke)) {
      state |= ReplayButtonState.Smoke;
    }

    return new LegacyReplayFrame(
      this.startTime,
      this.interval,
      this.position,
      state,
    );
  }
}
