import { ObjectCopying } from '../../Utils';

import { HitSound } from '../Enums/HitSound';
import { SampleSet } from '../Enums/SampleSet';

/**
 * An object describing the name of a sound file,
 * which has the following format:
 *
 * <sampleSet>-hit<hitSound><index>.wav
 */
export class HitSample {
  /**
   * The bank to load the sample } from.
   */
  sampleSet: string = SampleSet[SampleSet.None];

  /**
   * Hit sound data.
   */
  hitSound: string = HitSound[HitSound.Normal];

  /**
   * Custom index of hit sample.
   */
  customIndex = 0;

  /**
   * An optional suffix to provide priority lookup.
   * Falls back to non-suffixed name.
   */
  suffix = '';

  /**
   * The sample volume.
   */
  volume = 100;

  /**
   * Whether this hit sample is layered.
   */
  isLayered = false;

  /**
   * The filename of this hit sample.
   */
  filename = '';

  /**
   * Creates a copy of this hit sample.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied hit sample.
   */
  clone(): HitSample {
    const cloned = new HitSample();

    const properties = ObjectCopying.copy(this);

    Object.assign(cloned, properties);

    return cloned;
  }
}
