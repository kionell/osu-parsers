import { HitSample, SliderPath } from 'osu-resources';

import { ParsedHitObject } from './ParsedHitObject';

/**
 * A parsed slidable object.
 */
export class ParsedSlider extends ParsedHitObject {
  /**
   * The amount of times a slidable object repeats.
   */
  repeats = 0;

  /**
   * The positional length of a slidable object.
   */
  pixelLength = 0;

  /**
   * The curve of a slidable object.
   */
  path: SliderPath = new SliderPath();

  /**
   * The last tick offset of slidable objects in osu!stable.
   */
  legacyLastTickOffset = 36;

  /**
   * The samples to be played when each node of the slidable object is hit.
   * 0: The first node.
   * 1: The first repeat.
   * 2: The second repeat.
   * ...
   * n-1: The last repeat.
   * n: The last node.
   */
  nodeSamples: HitSample[][] = [];

  /**
   * Creates a copy of this parsed slider.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed slider.
   */
  clone(): ParsedSlider {
    const cloned = new ParsedSlider();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;

    cloned.samples = this.samples.map((s) => s.clone());
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));

    cloned.repeats = this.repeats;
    cloned.pixelLength = this.pixelLength;
    cloned.path = this.path.clone();

    return cloned;
  }
}
