import { DifficultyHitObject, IHitObject } from 'osu-classes';
import { Hit } from '../../Objects';
import { TaikoDifficultyHitObjectRhythm } from './Rhythm/TaikoDifficultyHitObjectRhythm';
import { TaikoDifficultyHitObjectColour } from './Colour/TaikoDifficultyHitObjectColour';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TaikoColourDifficultyPreprocessor } from './Colour/TaikoColourDifficultyPreprocessor';

/**
 * Represents a single hit object in taiko difficulty calculation.
 */
export class TaikoDifficultyHitObject extends DifficultyHitObject {
  /**
   * The list of all {@link TaikoDifficultyHitObject} 
   * of the same colour as this {@link TaikoDifficultyHitObject} in the beatmap.
   */
  private readonly _monoDifficultyHitObjects: TaikoDifficultyHitObject[] | null;

  /**
   * The index of this {@link TaikoDifficultyHitObject} in {@link monoDifficultyHitObjects}.
   */
  readonly monoIndex: number;

  /**
   * The list of all {@link TaikoDifficultyHitObject} that 
   * is either a regular note or finisher in the beatmap
   */
  private readonly _noteDifficultyHitObjects: TaikoDifficultyHitObject[];

  /**
   * The index of this {@link TaikoDifficultyHitObject} in {@link noteDifficultyHitObjects}.
   */
  readonly noteIndex: number;

  /**
   * The rhythm required to hit this hit object.
   */
  readonly rhythm: TaikoDifficultyHitObjectRhythm;

  /**
   * Colour data for this hit object. This is used by colour evaluator 
   * to calculate colour difficulty, but can be used by other skills in the future.
   */
  readonly colour: TaikoDifficultyHitObjectColour;

  /**
   * Creates a new difficulty hit object.
   * @param hitObject The gameplay {@link IHitObject} associated with this difficulty object.
   * @param lastObject The gameplay {@link IHitObject} preceding hit object.
   * @param lastLastObject The gameplay {@link IHitObject} preceding last object.
   * @param clockRate The rate of the gameplay clock. Modified by speed-changing mods.
   * @param objects The list of all {@link DifficultyHitObject}s in the current beatmap.
   * @param centreHitObjects The list of centre (don) {@link DifficultyHitObject}s in the current beatmap.
   * @param rimHitObjects The list of rim (kat) {@link DifficultyHitObject}s in the current beatmap.
   * @param noteObjects The list of {@link DifficultyHitObject}s that is a hit 
   * (i.e. not a drumroll or swell) in the current beatmap.
   * @param index The position of this {@link DifficultyHitObject} in the objects list.
   */
  constructor(
    hitObject: IHitObject,
    lastObject: IHitObject,
    lastLastObject: IHitObject,
    clockRate: number,
    objects: DifficultyHitObject[],
    centreHitObjects: TaikoDifficultyHitObject[],
    rimHitObjects: TaikoDifficultyHitObject[],
    noteObjects: TaikoDifficultyHitObject[],
    index: number,
  ) {
    super(hitObject, lastObject, clockRate, objects, index);

    this._noteDifficultyHitObjects = noteObjects;

    /**
     * Create the Colour object, its properties should 
     * be filled in by {@link TaikoColourDifficultyPreprocessor}.
     */
    this.colour = new TaikoDifficultyHitObjectColour();
    this.rhythm = this._getClosestRhythm(lastObject, lastLastObject, clockRate);

    if ((hitObject as Hit)?.isRim) {
      this.monoIndex = rimHitObjects.length;
      rimHitObjects.push(this);
      this._monoDifficultyHitObjects = rimHitObjects;
    }
    else {
      this.monoIndex = centreHitObjects.length;
      centreHitObjects.push(this);
      this._monoDifficultyHitObjects = centreHitObjects;
    }

    if (hitObject instanceof Hit) {
      this.noteIndex = noteObjects.length;
      noteObjects.push(this);
    }
    else {
      this.noteIndex = 0;
    }
  }

  /**
   * List of most common rhythm changes in taiko maps.
   * The general guidelines for the values are:
   *  - rhythm changes with ratio closer to 1 (that are not 1) are harder to play,
   *  - speeding up is generally harder than slowing down 
   *  (with exceptions of rhythm changes requiring a hand switch).
   */
  private static readonly COMMON_RHYTHMS: TaikoDifficultyHitObjectRhythm[] = [
    new TaikoDifficultyHitObjectRhythm(1, 1, 0.0),
    new TaikoDifficultyHitObjectRhythm(2, 1, 0.3),
    new TaikoDifficultyHitObjectRhythm(1, 2, 0.5),
    new TaikoDifficultyHitObjectRhythm(3, 1, 0.3),
    new TaikoDifficultyHitObjectRhythm(1, 3, 0.35),
    new TaikoDifficultyHitObjectRhythm(3, 2, 0.6),
    new TaikoDifficultyHitObjectRhythm(2, 3, 0.4),
    new TaikoDifficultyHitObjectRhythm(5, 4, 0.5),
    new TaikoDifficultyHitObjectRhythm(4, 5, 0.7),
  ];

  /**
   * Returns the closest rhythm change from {@link COMMON_RHYTHMS} required to hit this object.
   * @param lastObject The gameplay {@link IHitObject} preceding this one.
   * @param lastLastObject The gameplay {@link IHitObject} preceding last object
   * @param clockRate The rate of the gameplay clock.
   */
  private _getClosestRhythm(lastObject: IHitObject, lastLastObject: IHitObject, clockRate: number) {
    const prevLength = (lastObject.startTime - lastLastObject.startTime) / clockRate;
    const ratio = this.deltaTime / prevLength;

    return TaikoDifficultyHitObject.COMMON_RHYTHMS.slice()
      .sort((a, b) => Math.abs(a.ratio - ratio) - Math.abs(b.ratio - ratio))[0];
  }

  previousMono(backwardsIndex: number): TaikoDifficultyHitObject | null {
    const index = this.monoIndex - (backwardsIndex + 1);

    return this._monoDifficultyHitObjects?.[index] ?? null;
  }

  nextMono(forwardsIndex: number): TaikoDifficultyHitObject | null {
    const index = this.monoIndex + (forwardsIndex + 1);

    return this._monoDifficultyHitObjects?.[index] ?? null;
  }

  previousNote(backwardsIndex: number): TaikoDifficultyHitObject | null {
    const index = this.noteIndex - (backwardsIndex + 1);

    return this._noteDifficultyHitObjects[index] ?? null;
  }

  nextNote(forwardsIndex: number): TaikoDifficultyHitObject | null {
    const index = this.noteIndex + (forwardsIndex + 1);

    return this._noteDifficultyHitObjects[index] ?? null;
  }
}
