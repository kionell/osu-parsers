import { Vector2 } from '../../Utils';

import { Command } from './Command';
import { IMovable } from './Types/IMovable';
import { CommandType } from '../Enums/CommandType';

/**
 * The move command.
 */
export class MoveCommand extends Command implements IMovable {
  type: CommandType = CommandType.Movement;

  /**
   * The start position of the move command.
   */
  startPosition: Vector2 = new Vector2(0, 0);

  /**
   * The end position of the move command.
   */
  endPosition: Vector2 = new Vector2(0, 0);

  /**
   * The start X-position of the move command.
   */
  get startX(): number {
    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
    this.endPosition.x = value;
  }

  /**
   * The start Y-position of the move command.
   */
  get startY(): number {
    return this.startPosition.y;
  }

  set startY(value: number) {
    this.startPosition.y = value;
    this.endPosition.y = value;
  }

  /**
   * The end X-position of the move command.
   */
  get endX(): number {
    return this.endPosition.x;
  }

  set endX(value: number) {
    this.endPosition.x = value;
  }

  /**
   * The end Y-position of the move command.
   */
  get endY(): number {
    return this.endPosition.y;
  }

  set endY(value: number) {
    this.endPosition.y = value;
  }

  /**
   * The acronym of the move command.
   */
  get acronym(): string {
    return 'M';
  }
}
