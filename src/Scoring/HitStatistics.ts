import { HitResult } from './Enums/HitResult';
import { IJsonableHitStatistics } from './IJsonableHitStatistics';

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

  /**
   * Converts this map to a readable JSON format.
   */
  toJSON(): IJsonableHitStatistics {
    const result: IJsonableHitStatistics = {};

    this.forEach((value, key) => {
      result[HitStatistics._getJsonableKeyFromHitResult(key)] = value;
    });

    return result;
  }

  static fromJSON(json: IJsonableHitStatistics): HitStatistics {
    const statistics = new HitStatistics();
    const entries = Object.entries(json);

    entries.forEach((entry) => {
      const key = entry[0] as keyof IJsonableHitStatistics;

      statistics.set(this._getHitResultFromJsonableKey(key), entry[1]);
    });

    return statistics;
  }

  private static _getJsonableKeyFromHitResult(result: HitResult): keyof IJsonableHitStatistics {
    switch (result) {
      case HitResult.None: return 'none';
      case HitResult.Miss: return 'miss';
      case HitResult.Meh: return 'meh';
      case HitResult.Ok: return 'ok';
      case HitResult.Good: return 'good';
      case HitResult.Great: return 'great';
      case HitResult.Perfect: return 'perfect';
      case HitResult.SmallTickMiss: return 'smallTickMiss';
      case HitResult.SmallTickHit: return 'smallTickHit';
      case HitResult.LargeTickMiss: return 'largeTickMiss';
      case HitResult.LargeTickHit: return 'largeTickHit';
      case HitResult.SmallBonus: return 'smallBonus';
      case HitResult.LargeBonus: return 'largeBonus';
      case HitResult.IgnoreMiss: return 'ignoreMiss';
      case HitResult.IgnoreHit: return 'ignoreHit';
    }
  }

  private static _getHitResultFromJsonableKey(key: keyof IJsonableHitStatistics): HitResult {
    switch (key) {
      case 'none': return HitResult.None;
      case 'miss': return HitResult.Miss;
      case 'meh': return HitResult.Meh;
      case 'ok': return HitResult.Ok;
      case 'good': return HitResult.Good;
      case 'great': return HitResult.Great;
      case 'perfect': return HitResult.Perfect;
      case 'smallTickMiss': return HitResult.SmallTickMiss;
      case 'smallTickHit': return HitResult.SmallTickHit;
      case 'largeTickMiss': return HitResult.LargeTickMiss;
      case 'largeTickHit': return HitResult.LargeTickHit;
      case 'smallBonus': return HitResult.SmallBonus;
      case 'largeBonus': return HitResult.LargeBonus;
      case 'ignoreMiss': return HitResult.IgnoreMiss;
      case 'ignoreHit': return HitResult.IgnoreHit;
    }
  }
}
