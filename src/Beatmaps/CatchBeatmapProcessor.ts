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
} from 'osu-classes';

export class CatchBeatmapProcessor extends BeatmapProcessor {
  static RNG_SEED = 1337;

  static BASE_SPEED = 1;

  static CATCHER_SIZE = 106.75;

  static PLAYFIELD_WIDTH = 512;

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

        this._lastX = juiceStream.originalX
          + controlPoints[controlPoints.length - 1].position.x;

        this._lastStartTime = juiceStream.startTime;

        const nestedHitObjects = juiceStream.nestedHitObjects;

        nestedHitObjects.forEach((nested) => {
          const juice = (nested as IHitObject) as CatchHitObject;

          juice.offsetX = 0;

          if (nested instanceof JuiceTinyDroplet) {
            const min = -juice.originalX;
            const max = min + CatchBeatmapProcessor.PLAYFIELD_WIDTH;

            juice.offsetX = Math.max(min, Math.min(this._rng.nextInt(-20, 20), max));
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
          banana.offsetX = this._rng.nextDouble() * CatchBeatmapProcessor.PLAYFIELD_WIDTH;

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
    let positionX = hitObject.originalX;
    const startTime = hitObject.startTime;

    if (this._lastX === null) {
      this._lastX = positionX;
      this._lastStartTime = startTime;

      return;
    }

    const xDiff = positionX - this._lastX;
    const timeDiff = Math.trunc(startTime - this._lastStartTime);

    if (timeDiff > 1000) {
      this._lastX = positionX;
      this._lastStartTime = startTime;

      return;
    }

    if (xDiff === 0) {
      positionX = this._applyRandomOffset(positionX, timeDiff / 4);

      hitObject.offsetX = positionX - hitObject.originalX;

      return;
    }

    if (Math.abs(xDiff) < timeDiff / 3) {
      positionX = this._applyOffset(positionX, xDiff);
    }

    hitObject.offsetX = positionX - hitObject.originalX;

    this._lastX = positionX;
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
    const right = this._rng.nextBool();
    const rand = Math.min(20, this._rng.nextInt(0, Math.max(0, maxOffset)));

    if (right) {
      // Clamp to the right bound
      if (position + rand <= CatchBeatmapProcessor.PLAYFIELD_WIDTH) {
        position += rand;
      }
      else {
        position -= rand;
      }
    }
    else {
      // Clamp to the left bound
      if (position - rand >= 0) {
        position -= rand;
      }
      else {
        position += rand;
      }
    }

    return position;
  }

  /**
   * Applies an offset to a position, ensuring that the
   * final position remains within the boundary of the playfield.
   * @param position The position which the offset should be applied to.
   * @param amount The amount to offset by.
   */
  private _applyOffset(position: number, amount: number): number {
    if (amount > 0) {
      // Clamp to the right bound
      if (position + amount < CatchBeatmapProcessor.PLAYFIELD_WIDTH) {
        position += amount;
      }
    }
    else {
      // Clamp to the left bound
      if (position + amount > 0) {
        position += amount;
      }
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

    const scale = 1 - (0.7 * (beatmap.difficulty.circleSize - 5)) / 5;

    const halfCatcherWidth = (CatchBeatmapProcessor.CATCHER_SIZE * Math.abs(scale)) / 2;

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
      const timeToNext = next.startTime - current.startTime - Math.fround(1000 / 60) / 4;

      const distanceToNext = Math.abs(next.effectiveX - current.effectiveX) -
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
