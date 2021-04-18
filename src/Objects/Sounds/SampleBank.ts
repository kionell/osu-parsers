import { ObjectCopying } from '../../Utils';

import { SampleSet } from '../Enums/SampleSet';

export class SampleBank {
  /**
   * The filepath of this sample bank.
   */
  filename = '';

  /**
   * The volume of the bank.
   */
  volume = 100;

  /**
   * The normal sample set of the bank.
   */
  normalSet: SampleSet = SampleSet.Normal;

  /**
   * The addition sample set of the bank.
   */
  additionSet: SampleSet = SampleSet.Normal;

  /**
   * Custom index of the sample bank.
   */
  customIndex = 0;

  /**
   * Creates a copy of this sample bank.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied sample bank.
   */
  clone(): SampleBank {
    const cloned = new SampleBank();

    const properties = ObjectCopying.copy(this);

    Object.assign(cloned, properties);

    return cloned;
  }
}
