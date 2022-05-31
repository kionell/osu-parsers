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
  HitType,
  IBeatmap,
  IHasPosition,
  IHitObject,
  IHoldableObject,
  Vector2,
} from 'osu-classes';

export class EndTimeObjectPatternGenerator extends PatternGenerator {
  protected readonly endTime: number;

  protected readonly convertType: PatternType;

  constructor(
    hitObject: IHitObject,
    beatmap: ManiaBeatmap,
    originalBeatmap: IBeatmap,
    previousPattern: Pattern,
    rng: FastRandom,
  ) {
    super(hitObject, beatmap, originalBeatmap, previousPattern, rng);

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
  protected addToPattern(pattern: Pattern, column: number, isHoldNote: boolean): void {
    if (isHoldNote) {
      const hold = new Hold();
      const posData = this.hitObject as unknown as IHasPosition;

      hold.startTime = this.hitObject.startTime;
      hold.endTime = this.endTime;
      hold.originalColumn = column;
      hold.hitType = HitType.Hold | (this.hitObject.hitType & HitType.NewCombo);
      hold.samples = this.hitObject.samples;
      hold.nodeSamples = (this.hitObject as IHoldableObject).nodeSamples ?? [];
      hold.startPosition = posData?.startPosition ?? new Vector2(256, 192);

      pattern.addHitObject(hold);
    }
    else {
      const note = new Note();
      const posData = this.hitObject as unknown as IHasPosition;

      note.startTime = this.hitObject.startTime;
      note.originalColumn = column;
      note.hitType = HitType.Normal | (this.hitObject.hitType & HitType.NewCombo);
      note.samples = this.hitObject.samples;
      note.startPosition = posData?.startPosition ?? new Vector2(256, 192);

      pattern.addHitObject(note);
    }
  }
}
