import {
  IConvertibleReplayFrame,
  LegacyReplayFrame,
  ReplayButtonState,
  ReplayFrame,
  Vector2,
} from 'osu-classes';

import { CatchAction } from './Enums/CatchAction';

export class CatchReplayFrame extends ReplayFrame implements IConvertibleReplayFrame {
  /**
   * Player position of this replay frame.
   */
  position = 0;

  /**
   * Whether the player is in dashing state or not.
   */
  isDashing = false;

  /**
   * Button actions of this replay frame.
   */
  actions: Set<CatchAction> = new Set();

  fromLegacy(
    currentFrame: LegacyReplayFrame,
    lastFrame: CatchReplayFrame | null,
  ): this {
    this.startTime = currentFrame.startTime;
    this.interval = currentFrame.interval;
    this.position = currentFrame.position.x;
    this.isDashing = currentFrame.buttonState === ReplayButtonState.Left1;

    if (this.isDashing) {
      this.actions.add(CatchAction.Dash);
    }

    /**
     * This probably needs some cross-checking with osu-stable 
     * to ensure it is actually correct.
     */
    if (lastFrame instanceof CatchReplayFrame) {
      if (this.position > lastFrame.position) {
        lastFrame.actions.add(CatchAction.MoveRight);
      }

      if (this.position < lastFrame.position) {
        lastFrame.actions.add(CatchAction.MoveLeft);
      }
    }

    return this;
  }

  toLegacy(): LegacyReplayFrame {
    let state = ReplayButtonState.None;

    if (this.actions.has(CatchAction.Dash)) {
      state |= ReplayButtonState.Left1;
    }

    return new LegacyReplayFrame(
      this.startTime,
      this.interval,
      new Vector2(this.position, 0),
      state,
    );
  }
}
