import { Vector2 } from '../../Utils';

import { Command } from '../Commands/Command';
import { CommandLoop } from '../Compounds/CommandLoop';
import { CommandTrigger } from '../Compounds/CommandTrigger';
import { IHasCommands } from './Types/IHasCommands';
import { Origins } from '../Enums/Origins';
import { LayerType } from '../Enums/LayerType';

/**
 * A storyboard sprite.
 */
export class StoryboardSprite implements IHasCommands {
  /**
   * The layer of the storyboard sprite.
   */
  layer: LayerType = LayerType.Background;

  /**
   * The origin of the image on the screen.
   */
  origin: Origins = Origins.Custom;

  /**
   * The relative start position of the storyboard sprite.
   */
  startPosition: Vector2 = new Vector2(0, 0);

  /**
   * The file path of the content of this storyboard sprite.
   */
  filePath = '';

  /**
   * The list of commands of the storyboard sprite.
   */
  commands: Command[] = [];

  /**
   * The list of command loops of the storyboard sprite.
   */
  loops: CommandLoop[] = [];

  /**
   * The list of command triggers of the storyboard sprite.
   */
  triggers: CommandTrigger[] = [];

  /**
   * The start X-position of the storyboard sprite.
   */
  get startX(): number {
    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
  }

  /**
   * The start Y-position of the storyboard sprite.
   */
  get startY(): number {
    return this.startPosition.y;
  }

  set startY(value: number) {
    this.startPosition.y = value;
  }

  /**
   * The start time of the storyboard sprite.
   */
  get startTime(): number {
    const commands = this.commands.slice();
    const loops = this.loops.filter((l) => l.commands.length);

    const commandsStart = commands.reduce((minStart, command) => {
      return minStart > command.startTime ? command.startTime : minStart;
    }, Infinity);

    const loopsStart = loops.reduce((minStart, loop) => {
      const minLoopStart = loop.commands.reduce((min, command) => {
        return min > command.startTime ? command.startTime : min;
      }, Infinity);

      return minStart > minLoopStart ? minLoopStart : minStart;
    }, Infinity);

    return Math.min(commandsStart, loopsStart);
  }

  /**
   * The end time of the storyboard sprite.
   */
  get endTime(): number {
    const commands = this.commands.slice();
    const loops = this.loops.filter((l) => l.commands.length);

    const commandsStart = commands.reduce((maxStart, command) => {
      return maxStart < command.startTime ? command.startTime : maxStart;
    }, -Infinity);

    const loopsStart = loops.reduce((maxStart, loop) => {
      const maxLoopStart = loop.commands.reduce((max, command) => {
        return max < command.startTime ? command.startTime : max;
      }, -Infinity);

      return maxStart < maxLoopStart ? maxLoopStart : maxStart;
    }, -Infinity);

    return Math.max(commandsStart, loopsStart);
  }
}
