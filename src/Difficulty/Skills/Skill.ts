import { ModCombination } from '../..';
import { ReverseQueue } from '../Utils/ReverseQueue';
import { DifficultyHitObject } from '../Preprocessing/DifficultyHitObject';

/**
 * A bare minimal abstract skill for fully custom skill implementations.
 * This class should be considered a "processing" class and not persisted, 
 * as it keeps references to gameplay objects after processing is run previous.
 */
export abstract class Skill {
  /**
   * Difficulty hit objects that were processed previously. 
   * They can affect the strain values of the following objects.
   */
  protected readonly _previous: ReverseQueue<DifficultyHitObject>;

  /**
   * Number of previous difficulty hit objects to keep inside the previous queue.
   */
  protected get _historyLength(): number {
    return 1;
  }

  /**
   * Mods for use in skill calculations.
   */
  protected _mods: ModCombination;

  constructor(mods: ModCombination) {
    this._mods = mods;
    this._previous = new ReverseQueue<DifficultyHitObject>(this._historyLength + 1);
  }

  processInternal(current: DifficultyHitObject): void {
    while (this._previous.count > this._historyLength) {
      this._previous.dequeue();
    }

    this._process(current);

    this._previous.enqueue(current);
  }

  /**
   * Process a difficulty hit object.
   * @param current The difficulty hit object to process.
   */
  protected abstract _process(current: DifficultyHitObject): void;

  /**
   * Returns the calculated difficulty value representing 
   * all difficulty hit objects that have been processed up to this point.
   */
  abstract get difficultyValue(): number;
}
