import { Vector2 } from '../../Utils';
import { Command } from '../Commands/Command';
import { IMovable } from './Types/IMovable';
import { CommandType } from '../Enums/CommandType';

/**
 * The move command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class MoveCommand extends Command<Vector2> implements IMovable {
  type: CommandType = CommandType.Movement;

  /**
   * The start position of the move command.
   */
  get startPosition(): Vector2 {
    return this.startValue;
  }

  set startPosition(value: Vector2) {
    this.startValue = value;
  }

  /**
   * The end position of the move command.
   */
  get endPosition(): Vector2 {
    return this.endValue;
  }

  set endPosition(value: Vector2) {
    this.endValue = value;
  }

  /**
   * The start X-position of the move command.
   */
  get startX(): number {
    return this.startValue.x;
  }

  set startX(value: number) {
    this.startValue.x = value;
  }

  /**
   * The start Y-position of the move command.
   */
  get startY(): number {
    return this.startValue.y;
  }

  set startY(value: number) {
    this.startValue.y = value;
  }

  /**
   * The end X-position of the move command.
   */
  get endX(): number {
    return this.endValue.x;
  }

  set endX(value: number) {
    this.endValue.x = value;
  }

  /**
   * The end Y-position of the move command.
   */
  get endY(): number {
    return this.endValue.y;
  }

  set endY(value: number) {
    this.endValue.y = value;
  }

  /**
   * The acronym of the move command.
   */
  get acronym(): string {
    return 'M';
  }
}
