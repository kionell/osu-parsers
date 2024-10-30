import { ColumnType } from '../Enums/ColumnType';

/**
 * Defines properties for each stage in a osu!mania playfield.
 */
export class StageDefinition {
  /**
   * The number of columns which this stage contains.
   */
  columns;

  constructor(columns?: number) {
    this.columns = columns ?? 0;
  }

  /**
   * Whether the column index is a special column for this stage.
   * @param column The 0-based column index.
   * @returns Whether the column is a special column.
   */
  isSpecialColumn(column: number): boolean {
    return this.columns % 2 === 1 && this.columns / 2 === column;
  }

  /**
   * Get the type of column given a column index.
   * @param column The 0-based column index.
   * @returns The type of the column.
   */
  getTypeOfColumn(column: number): ColumnType {
    if (this.isSpecialColumn(column)) {
      return ColumnType.Special;
    }

    const distanceToEdge = Math.min(column, this.columns - 1 - column);

    return distanceToEdge % 2 ? ColumnType.Even : ColumnType.Odd;
  }

  /**
   * Creates a new copy of this stage definition.
   * @returns The copy of this stage definition.
   */
  clone(): StageDefinition {
    return new StageDefinition(this.columns);
  }
}
