import { ManiaHitObject } from '../../Objects/ManiaHitObject';

/**
 * Creates a pattern containing hit objects.
 */
export class Pattern {
  /**
   * All hit objects contained in this pattern.
   */
  hitObjects: ManiaHitObject[] = [];

  /**
   * All columns contained in this pattern
   */
  containedColumns: Set<number> = new Set();

  /**
   * Check whether a column of this patterns contains a hit object.
   * @param column The column index.
   * @returns Whether the column contains a hit object.
   */
  columnHasObject(column: number): boolean {
    return this.containedColumns.has(column);
  }

  /**
   * Amount of columns taken up by hit objects in this pattern.
   */
  get columnsWithObjects(): number {
    return this.containedColumns.size;
  }

  /**
   * Adds a hit object to this pattern.
   * @param hitObject The hit object to add.
   */
  addHitObject(hitObject: ManiaHitObject): void {
    this.hitObjects.push(hitObject);
    this.containedColumns.add(hitObject.column);
  }

  /**
   * Copies hit object from another pattern to this one.
   * @param other The other pattern.
   */
  addPatternHitObjects(other: Pattern): void {
    this.hitObjects.push(...other.hitObjects);

    other.hitObjects.forEach((h) => {
      this.containedColumns.add(h.column);
    });
  }

  /**
   * Clears this pattern, removing all hit objects.
   */
  clear(): void {
    this.hitObjects.length = 0;
    this.containedColumns.clear();
  }
}
