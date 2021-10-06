import {
  IBeatmap,
  IHitObject,
  IHoldableObject,
  ISlidableObject,
  ISpinnableObject,
  HitSound,
  HitType,
  SampleSet,
  HitSample,
  Vector2,
} from 'osu-resources';

import { ParsedHitObject } from '../../Classes/ParsedHitObject';

/**
 * An encoder for beatmap hit objects.
 */
export abstract class HitObjectEncoder {
  /**
   * Encodes all beatmap hit objects.
   * @param beatmap A beatmap.
   * @returns A single string with encoded beatmap hit objects.
   */
  static encodeHitObjects(beatmap: IBeatmap): string {
    // x,y,time,type,hitSound,objectParams,hitSample

    const encoded: string[] = ['[HitObjects]'];

    const difficulty = beatmap.difficulty;
    const hitObjects = beatmap.hitObjects;

    hitObjects.forEach((hitObject) => {
      const general: string[] = [];

      const parsedObject = hitObject as ParsedHitObject;
      /**
       * Try to get hit object position if possible.
       * Otherwise, it will be replaced with default position (256, 192).
       */
      const position = new Vector2(256, 192);

      position.x = parsedObject.startX || 256;
      position.y = parsedObject.startY || 192;

      if (beatmap.mode === 3) {
        const totalColumns = Math.trunc(Math.max(1, difficulty.circleSize));
        const multiplier = Math.round(512 / totalColumns * 100000) / 100000;

        position.x = Math.ceil(parsedObject.startX * multiplier);
      }

      general.push(position.toString());
      general.push(hitObject.startTime.toString());
      general.push(hitObject.hitType.toString());
      general.push(hitObject.hitSound.toString());

      const extras: string[] = [];

      if (hitObject.hitType & HitType.Slider) {
        const slider = (hitObject as IHitObject) as ISlidableObject;

        // curveType|curvePoints,slides,length,edgeSounds,edgeSets

        const path: string[] = [];

        path.push(slider.path.curveType);

        slider.path.curvePoints.forEach((curvePoint) => {
          const x = position.x + curvePoint.x;
          const y = position.y + curvePoint.y;

          path.push(`${x}:${y}`);
        });

        extras.push(path.join('|'));

        /**
         * osu!stable treated the first span of the slider as a repeat,
         * but no repeats are happening.
         */
        extras.push((slider.repeats + 1).toString());
        extras.push(slider.pixelLength.toString());

        const adds: number[] = [];
        const sets: number[][] = [];

        slider.nodeSamples.forEach((node, nodeIndex) => {
          adds[nodeIndex] = HitSound.None;
          sets[nodeIndex] = [SampleSet.None, SampleSet.None];

          node.forEach((sample, sampleIndex) => {
            if (sampleIndex === 0) {
              sets[nodeIndex][0] = (SampleSet as any)[sample.sampleSet];
            }
            else {
              adds[nodeIndex] |= (HitSound as any)[sample.hitSound];
              sets[nodeIndex][1] = (SampleSet as any)[sample.sampleSet];
            }
          });
        });

        extras.push(adds.join('|'));
        extras.push(sets.map((set) => set.join(':')).join('|'));
      }
      else if (hitObject.hitType & HitType.Spinner) {
        const spinner = (hitObject as IHitObject) as ISpinnableObject;

        // endTime

        extras.push(spinner.endTime.toString());
      }
      else if (hitObject.hitType & HitType.Hold) {
        const hold = (hitObject as IHitObject) as IHoldableObject;

        // endTime

        extras.push(hold.endTime.toString());
      }

      // normalSet:additionSet:index:volume:filename

      const set: string[] = [];

      const normal = hitObject.samples.find((s) => s.hitSound === HitSound[HitSound.Normal]);

      const addition = hitObject.samples.find((s) => s.hitSound !== HitSound[HitSound.Normal]);

      let normalSet = SampleSet.None;
      let additionSet = SampleSet.None;

      if (normal) {
        normalSet = (SampleSet as any)[(normal as HitSample).sampleSet];
      }

      if (addition) {
        additionSet = (SampleSet as any)[(addition as HitSample).sampleSet];
      }

      set[0] = normalSet.toString();
      set[1] = additionSet.toString();
      set[2] = hitObject.samples[0].customIndex.toString();
      set[3] = hitObject.samples[0].volume.toString();
      set[4] = hitObject.samples[0].filename;

      extras.push(set.join(':'));

      const generalLine = general.join(',');

      const extrasLine =
        hitObject.hitType & HitType.Hold ? extras.join(':') : extras.join(',');

      encoded.push([generalLine, extrasLine].join(','));
    });

    return encoded.join('\n');
  }
}
