import {
  IBeatmap,
  IConvertibleReplayFrame,
  LegacyReplayFrame,
  ReplayButtonState,
  ReplayFrame,
  Vector2,
} from 'osu-classes';

import { ManiaAction } from './Enums/ManiaAction';
import { ManiaBeatmap } from '../Beatmaps/ManiaBeatmap';

export class ManiaReplayFrame extends ReplayFrame implements IConvertibleReplayFrame {
  /**
   * Button actions of this replay frame.
   */
  actions: Set<ManiaAction> = new Set();

  fromLegacy(
    currentFrame: LegacyReplayFrame,
    _: ManiaReplayFrame | null,
    beatmap?: IBeatmap,
  ): this {
    if (!beatmap) {
      throw new Error('Beatmap must be provided to convert osu!mania replay frames.');
    }

    const maniaBeatmap = beatmap as ManiaBeatmap;

    let normalAction = ManiaAction.Key1;
    let specialAction = ManiaAction.Special1;

    let activeColumns = Math.trunc(currentFrame.mouseX ?? 0);
    let counter = 0;

    while (activeColumns > 0) {
      const isSpecial = this._isColumnAtIndexSpecial(maniaBeatmap, counter);

      if ((activeColumns & 1) > 0) {
        this.actions.add(isSpecial ? specialAction : normalAction);
      }

      isSpecial ? specialAction++ : normalAction++;

      counter++;
      activeColumns >>= 1;
    }

    return this;
  }

  toLegacy(beatmap?: IBeatmap): LegacyReplayFrame {
    if (!beatmap) {
      throw new Error('Beatmap must be provided to convert osu!mania replay frames.');
    }

    const maniaBeatmap = beatmap as ManiaBeatmap;

    let keys = 0;

    for (const action of this.actions) {
      if (action === ManiaAction.Special1) {
        keys |= 1 << this._getSpecialColumnIndex(maniaBeatmap, 0);

        continue;
      }

      if (action === ManiaAction.Special2) {
        keys |= 1 << this._getSpecialColumnIndex(maniaBeatmap, 1);

        continue;
      }

      /**
       * The index in lazer, which doesn't include special keys.
       */
      let nonSpecialKeyIndex = action - ManiaAction.Key1;

      /**
       * The index inclusive of special keys.
       */
      let overallIndex = 0;

      /**
       * Iterate to find the index including special keys.
       */
      while (overallIndex < maniaBeatmap.totalColumns) {
        /**
         * Skip over special columns.
         */
        if (this._isColumnAtIndexSpecial(maniaBeatmap, overallIndex)) {
          continue;
        }

        /**
         * Found a non-special column to use.
         */
        if (nonSpecialKeyIndex === 0) {
          break;
        }

        /**
         * Found a non-special column but not ours.
         */
        nonSpecialKeyIndex--;
        overallIndex++;
      }

      keys |= 1 << overallIndex;
    }

    return new LegacyReplayFrame(
      this.startTime,
      this.interval,
      new Vector2(keys, 0),
      ReplayButtonState.None,
    );
  }

  /**
   * Find the overall index (across all stages) for a specified special key.
   * @param maniaBeatmap The beatmap.
   * @param specialOffset The special key offset (0 is S1).
   * @returns The overall index for the special column.
   */
  private _getSpecialColumnIndex(
    maniaBeatmap: ManiaBeatmap,
    specialOffset: number,
  ): number {
    for (let i = 0; i < maniaBeatmap.totalColumns; ++i) {
      if (this._isColumnAtIndexSpecial(maniaBeatmap, i)) {
        if (specialOffset === 0) return i;

        specialOffset--;
      }
    }

    throw new Error('Special key index is too high.');
  }

  /**
   * @param beatmap The beatmap.
   * @param index The overall index to check.
   * @returns Whether the column at an overall index 
   * (across all stages) is a special column.
   */
  private _isColumnAtIndexSpecial(beatmap: ManiaBeatmap, index: number): boolean {
    for (const stage of beatmap.stages) {
      if (index >= stage.columns) {
        index -= stage.columns;
        continue;
      }

      return stage.isSpecialColumn(index);
    }

    throw new Error('Column index is too high.');
  }
}
