import { IBeatmap } from '../../Beatmaps';
import { IReplayFrame } from '../IReplayFrame';
import { LegacyReplayFrame } from '../LegacyReplayFrame';

/**
 * A type of {@link IReplayFrame} which can be converted from a {@link LegacyReplayFrame}.
 */
export interface IConvertibleReplayFrame extends IReplayFrame {
  /**
   * Populates this {@link ReplayFrame} using values from a {@link LegacyReplayFrame}.
   * @param currentFrame The {@link LegacyReplayFrame} to extract values from.
   * @param beatmap The beatmap of the replay which is used to get some data.
   * @param lastFrame The last post-conversion {@link ReplayFrame}, 
   * used to fill in missing delta information. May be null.
   * @returns A reference to this replay frame.
   */
  fromLegacy(
    currentFrame: LegacyReplayFrame,
    lastFrame: IReplayFrame | null,
    beatmap?: IBeatmap,
  ): this;

  /**
   * Populates this {@link ReplayFrame} using values from a {@link LegacyReplayFrame}.
   * @param beatmap The beatmap of the replay which is used to get some data.
   * @returns A new instance of legacy replay frame.
   */
  toLegacy(beatmap?: IBeatmap): LegacyReplayFrame;
}
