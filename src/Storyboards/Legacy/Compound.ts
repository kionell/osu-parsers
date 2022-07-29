import { CompoundType } from '../Enums/CompoundType';
import { CommandTimelineGroup } from '../Commands/CommandTimelineGroup';

/**
 * A storyboard compounded command.
 * Use {@link CommandTimelineGroup} class instead
 * @deprecated Since 0.10.0
 */
export abstract class Compound extends CommandTimelineGroup {
  /**
   * The type of the compounded command.
   */
  type: CompoundType = CompoundType.None;
}
