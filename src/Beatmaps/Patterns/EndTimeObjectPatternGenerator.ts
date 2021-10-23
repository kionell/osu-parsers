import { ManiaBeatmap } from '../ManiaBeatmap';
import { PatternGenerator } from './PatternGenerator';
import { PatternType } from '../../Enums/PatternType';
import { Pattern } from './Pattern';
import { Note } from '../../Objects/Note';
import { Hold } from '../../Objects/Hold';

import {
  FastRandom,
  HitSample,
  HitSound,
  IHitObject,
  IHoldableObject,
} from 'osu-resources';

export class EndTimeObjectPatternGenerator extends PatternGenerator {
  protected readonly endTime: number;

  protected readonly convertType: PatternType;

  constructor(hitObject: IHitObject, beatmap: ManiaBeatmap, previousPattern: Pattern, rng: FastRandom) {
    super(hitObject, beatmap, previousPattern, rng);

    this.endTime = Math.trunc((hitObject as IHoldableObject).endTime || 0);

    this.convertType =
      previousPattern.columnsWithObjects === this.totalColumns
        ? PatternType.None
        : PatternType.ForceNotStack;
  }

  *generate(): Generator<Pattern> {
    const pattern = new Pattern();

    const shouldGenerateHold = this.endTime - this.hitObject.startTime >= 100;

    switch (this.totalColumns) {
      case 8: {
        const findFinish = (sample: HitSample) => {
          return sample.hitSound === HitSound[HitSound.Finish];
        };

        const hasFinish = !!this.hitObject.samples.find(findFinish);

        if (hasFinish && this.endTime - this.hitObject.startTime < 1000) {
          this.addToPattern(pattern, 0, shouldGenerateHold);
          break;
        }

        this.addToPattern(pattern, this.getRandomColumn(), shouldGenerateHold);
        break;
      }

      default:
        this.addToPattern(pattern, this.getRandomColumn(0), shouldGenerateHold);
        break;
    }

    yield pattern;
  }

  protected getRandomColumn(lowerBound?: number): number {
    const column = super.getRandomColumn(lowerBound);

    if (this.convertType & PatternType.ForceNotStack) {
      const options = {
        lowerBound,
        patterns: [this.previousPattern],
      };

      return this.findAvailableColumn(column, options);
    }

    return this.findAvailableColumn(column, { lowerBound });
  }

  /**
   * Constructs and adds a note to a pattern.
   * @param pattern The pattern to add to.
   * @param column The column to add the note to.
   * @param holdNote Whether to add a hold note.
   */
  protected addToPattern(
    pattern: Pattern,
    column: number,
    isHoldNote: boolean
  ): void {
    if (isHoldNote) {
      const newObject = new Hold(this.hitObject.clone());

      newObject.endTime = this.endTime;
      newObject.originalColumn = column;
      newObject.nodeSamples = (this.hitObject as IHoldableObject).nodeSamples;

      pattern.addHitObject(newObject);
    }
    else {
      const newObject = new Note(this.hitObject.clone());

      newObject.originalColumn = column;

      pattern.addHitObject(newObject);
    }
  }
}
