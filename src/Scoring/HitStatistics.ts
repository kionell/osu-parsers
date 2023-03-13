import { HitResult } from './Enums/HitResult';

/**
 * A special case of a map structure for storing hit statistics.
 */
export class HitStatistics extends Map<HitResult, number> {
  /**
   * Gets the number of hit results by their type.
   * If hit result is not present sets it to default value and returns it.
   * @param key Hit result type.
   * @returns The number of hit results of this type.
   */
  get(key: HitResult): number {
    if (!super.has(key)) super.set(key, 0);

    return super.get(key) as number;
  }
}
