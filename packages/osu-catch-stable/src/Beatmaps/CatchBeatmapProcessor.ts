import { CatchBeatmap } from './CatchBeatmap';

import {
  CatchHitObject,
  PalpableHitObject,
  Fruit,
  JuiceStream,
  JuiceDroplet,
  JuiceTinyDroplet,
  BananaShower,
  Banana,
} from '../Objects';

import {
  FastRandom,
  BeatmapProcessor,
  IHitObject,
  ModBitwise,
  HitType,
  SortHelper,
  MathUtils,
} from 'osu-classes';
import { CatchPlayfield } from '../UI/CatchPlayfield';

export class CatchBeatmapProcessor extends BeatmapProcessor {
  static RNG_SEED = 1337;

  static BASE_SPEED = 1;

  private _lastX: number | null = null;

  private _lastStartTime = 0;

  private _rng = new FastRandom(CatchBeatmapProcessor.RNG_SEED);

  postProcess(beatmap: CatchBeatmap): CatchBeatmap {
    super.postProcess(beatmap);

    this._applyXOffsets(beatmap);

    return beatmap;
  }

  private _applyXOffsets(beatmap: CatchBeatmap) {
    const shouldApplyHR = beatmap.mods.has(ModBitwise.HardRock);

    const hitObjects = beatmap.hitObjects;

    hitObjects.forEach((hitObject) => {
      hitObject.offsetX = 0;

      if (hitObject.hitType & HitType.Normal) {
        const fruit = hitObject as Fruit;

        if (shouldApplyHR) {
          this._applyHardRockOffset(fruit);
        }
      }

      if (hitObject.hitType & HitType.Slider) {
        const juiceStream = hitObject as JuiceStream;
        const controlPoints = juiceStream.path.controlPoints;

        this._lastX = Math.fround(juiceStream.originalX
          + controlPoints[controlPoints.length - 1].position.x,
        );

        this._lastStartTime = juiceStream.startTime;

        const nestedHitObjects = juiceStream.nestedHitObjects;

        nestedHitObjects.forEach((nested) => {
          const juice = (nested as IHitObject) as CatchHitObject;

          juice.offsetX = 0;

          if (nested instanceof JuiceTinyDroplet) {
            juice.offsetX = MathUtils.clamp(
              this._rng.nextInt(-20, 20),
              -juice.originalX,
              Math.fround(CatchPlayfield.PLAYFIELD_WIDTH - juice.originalX),
            );
          }
          else if (nested instanceof JuiceDroplet) {
            // Osu!stable retrieved a random droplet rotation.
            this._rng.next();
          }
        });
      }

      if (hitObject.hitType & HitType.Spinner) {
        const bananaShower = hitObject as BananaShower;
        const bananas = bananaShower.nestedHitObjects as Banana[];

        bananas.forEach((banana) => {
          banana.offsetX = Math.fround(
            this._rng.nextDouble() * CatchPlayfield.PLAYFIELD_WIDTH,
          );

          // Osu!stable retrieved a random banana type.
          this._rng.next();

          // Osu!stable retrieved a random banana rotation.
          this._rng.next();

          // Osu!stable retrieved a random banana colour.
          this._rng.next();
        });
      }
    });

    this._initialiseHyperDash(beatmap);
  }

  private _applyHardRockOffset(hitObject: CatchHitObject): void {
    let offsetPosition = hitObject.originalX;
    const startTime = hitObject.startTime;

    if (this._lastX === null) {
      this._lastX = offsetPosition;
      this._lastStartTime = startTime;

      return;
    }

    const xDiff = Math.fround(offsetPosition - this._lastX);
    const timeDiff = Math.trunc(startTime - this._lastStartTime);

    if (timeDiff > 1000) {
      this._lastX = offsetPosition;
      this._lastStartTime = startTime;

      return;
    }

    if (xDiff === 0) {
      offsetPosition = this._applyRandomOffset(offsetPosition, timeDiff / 4);

      hitObject.offsetX = Math.fround(offsetPosition - hitObject.originalX);

      return;
    }

    if (Math.abs(xDiff) < Math.trunc(timeDiff / 3)) {
      offsetPosition = this._applyOffset(offsetPosition, xDiff);
    }

    hitObject.offsetX = Math.fround(offsetPosition - hitObject.originalX);

    this._lastX = offsetPosition;
    this._lastStartTime = startTime;
  }

  /**
   * Applies a random offset in a random direction to a position, ensuring
   * that the final position remains within the boundary of the playfield.
   * @param position The position which the offset should be applied to.
   * @param maxOffset The maximum offset, cannot exceed 20px.
   * @param rng The random number generator.
   */
  private _applyRandomOffset(position: number, maxOffset: number): number {
    const left = !this._rng.nextBool();
    const rand = Math.min(
      20,
      Math.fround(this._rng.nextInt(0, Math.max(0, maxOffset))),
    );

    const positionPlusRand = Math.fround(position + rand);
    const positionMinusRand = Math.fround(position - rand);

    if (left) {
      // Clamp to the left bound
      return positionMinusRand >= 0 ? positionMinusRand : positionPlusRand;
    }

    // Clamp to the right bound
    return positionPlusRand <= CatchPlayfield.PLAYFIELD_WIDTH
      ? positionPlusRand
      : positionMinusRand;
  }

  /**
   * Applies an offset to a position, ensuring that the
   * final position remains within the boundary of the playfield.
   * @param position The position which the offset should be applied to.
   * @param amount The amount to offset by.
   */
  private _applyOffset(position: number, amount: number): number {
    const positionPlusAmount = Math.fround(position + amount);

    if (amount > 0) {
      // Clamp to the right bound
      if (positionPlusAmount < CatchPlayfield.PLAYFIELD_WIDTH) {
        return positionPlusAmount;
      }
    }
    // Clamp to the left bound
    else if (positionPlusAmount > 0) {
      return positionPlusAmount;
    }

    return position;
  }

  private _initialiseHyperDash(beatmap: CatchBeatmap): void {
    const palpableObjects: PalpableHitObject[] = [];

    const hitObjects = beatmap.hitObjects;

    hitObjects.forEach((hitObject) => {
      if (hitObject.hitType & HitType.Normal) {
        palpableObjects.push(hitObject as PalpableHitObject);
      }
      else if (hitObject.hitType & HitType.Slider) {
        const juiceStream = hitObject as JuiceStream;
        const nestedHitObjects = juiceStream.nestedHitObjects;

        nestedHitObjects.forEach((nested) => {
          if (!(nested instanceof JuiceTinyDroplet)) {
            palpableObjects.push((nested as IHitObject) as PalpableHitObject);
          }
        });
      }
    });

    SortHelper.introSort(palpableObjects, (a, b) => a.startTime - b.startTime);

    let halfCatcherWidth = CatchPlayfield.calculateCatcherWidth(beatmap.difficulty) / 2;

    /**
     * TODO: This is wrong. osu!stable calculated hyperdashes 
     * using the full catcher size, excluding the margins.
     * This should theoretically cause impossible scenarios, but practically, 
     * likely due to the size of the playfield, it doesn't seem possible.
     * For now, to bring gameplay (and diffcalc!) completely in-line with stable, 
     * this code also uses the full catcher size.
     */
    halfCatcherWidth /= CatchPlayfield.ALLOWED_CATCH_RANGE;

    let lastDirection = 0;
    let lastExcess = halfCatcherWidth;

    for (let i = 0, len = palpableObjects.length - 1; i < len; ++i) {
      const current = palpableObjects[i];
      const next = palpableObjects[i + 1];

      // Reset variables in-case values have changed (e.g. after applying HR)
      current.hyperDashTarget = null;
      current.distanceToHyperDash = 0;

      const thisDirection = next.effectiveX > current.effectiveX ? 1 : -1;

      // 1/4th of a frame of grace time, taken } from osu-stable
      const timeToNext = next.startTime - current.startTime - Math.fround(Math.fround(1000 / 60) / 4);

      const distanceToNext = Math.abs(Math.fround(next.effectiveX - current.effectiveX)) -
        (lastDirection === thisDirection ? lastExcess : halfCatcherWidth);

      const distanceToHyper = Math.fround(timeToNext * CatchBeatmapProcessor.BASE_SPEED - distanceToNext);

      if (distanceToHyper < 0) {
        current.hyperDashTarget = next;
        lastExcess = halfCatcherWidth;
      }
      else {
        current.distanceToHyperDash = distanceToHyper;
        lastExcess = Math.max(0, Math.min(distanceToHyper, halfCatcherWidth));
      }

      lastDirection = thisDirection;
    }
  }
}
