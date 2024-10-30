import { DifficultyHitObject } from 'osu-classes';
import { TaikoDifficultyHitObject } from '../Preprocessing';
import { AlternatingMonoPattern } from '../Preprocessing/Colour/Data/AlternatingMonoPattern';
import { MonoStreak } from '../Preprocessing/Colour/Data/MonoStreak';
import { RepeatingHitPatterns } from '../Preprocessing/Colour/Data/RepeatingHitPatterns';

export class ColourEvaluator {
  /**
   * A sigmoid function. It gives a value between (middle - height/2) and (middle + height/2).
   *@param val The input value.
   * @param center The center of the sigmoid, where the largest gradient occurs and value is equal to middle.
   * @param width The radius of the sigmoid, outside of which values are near the minimum/maximum.
   * @param middle The middle of the sigmoid output.
   * @param height The height of the sigmoid output. This will be equal to max value - min value.
   */
  private static _sigmoid(val: number, center: number, width: number, middle: number, height: number) {
    const sigmoid = Math.tanh(Math.E * -(val - center) / width);

    return sigmoid * (height / 2) + middle;
  }

  /**
   * Evaluate the difficulty of the first note of a {@link MonoStreak}.
   */
  static evaluateDifficultyOfMono(monoStreak: MonoStreak): number {
    return this._sigmoid(monoStreak.index, 2, 2, 0.5, 1)
      * this.evaluateDifficultyOfAlternate(monoStreak.parent) * 0.5;
  }

  /**
   * Evaluate the difficulty of the first note of a {@link AlternatingMonoPattern}.
   */
  static evaluateDifficultyOfAlternate(alternatingMonoPattern: AlternatingMonoPattern): number {
    return this._sigmoid(alternatingMonoPattern.index, 2, 2, 0.5, 1)
      * this.evaluateDifficultyOfRepeat(alternatingMonoPattern.parent);
  }

  /**
   * Evaluate the difficulty of the first note of a {@link RepeatingHitPatterns}.
   */
  static evaluateDifficultyOfRepeat(repeatingHitPattern: RepeatingHitPatterns): number {
    return 2 * (1 - this._sigmoid(repeatingHitPattern.repetitionInterval, 2, 2, 0.5, 1));
  }

  static evaluateDifficultyOf(hitObject: DifficultyHitObject): number {
    const colour = (hitObject as TaikoDifficultyHitObject).colour;

    let difficulty = 0;

    if (colour?.monoStreak !== null) {
      difficulty += this.evaluateDifficultyOfMono(colour.monoStreak);
    }

    if (colour?.alternatingMonoPattern !== null) {
      difficulty += this.evaluateDifficultyOfAlternate(colour.alternatingMonoPattern);
    }

    if (colour?.repeatingHitPattern !== null) {
      difficulty += this.evaluateDifficultyOfRepeat(colour.repeatingHitPattern);
    }

    return difficulty;
  }
}
