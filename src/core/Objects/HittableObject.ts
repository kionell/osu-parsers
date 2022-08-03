import { HitObject, IHasCombo } from 'osu-classes';

/**
 * A hittable object.
 */
export class HittableObject extends HitObject implements IHasCombo {
  isNewCombo = false;
  comboOffset = 0;
}
