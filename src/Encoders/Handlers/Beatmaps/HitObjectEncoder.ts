import {
  IBeatmap,
  IHoldableObject,
  ISlidableObject,
  ISpinnableObject,
  HitSound,
  HitType,
  SampleSet,
  HitSample,
  Vector2,
  IHasPosition,
  PathType,
  IHasDuration,
} from 'osu-classes';

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
      const position = (hitObject as unknown as IHasPosition).startPosition;

      /**
       * Try to get hit object position if possible.
       * Otherwise, it will be replaced with default position (256, 192).
       */
      const startPosition = new Vector2(
        position ? position.x : 256,
        position ? position.y : 192
      );

      if (beatmap.mode === 3) {
        const totalColumns = Math.trunc(Math.max(1, difficulty.circleSize));
        const multiplier = Math.round(512 / totalColumns * 100000) / 100000;
        const column = (hitObject as unknown as IHasPosition).startX;

        startPosition.x = Math.ceil(column * multiplier) + Math.trunc(multiplier / 2);
      }

      general.push(startPosition.toString());
      general.push(hitObject.startTime.toString());
      general.push(hitObject.hitType.toString());
      general.push(hitObject.hitSound.toString());

      const extras: string[] = [];

      if (hitObject.hitType & HitType.Slider) {
        const slider = hitObject as ISlidableObject;

        extras.push(HitObjectEncoder.encodePathData(slider, startPosition));
      }
      else if (hitObject.hitType & HitType.Spinner) {
        const spinner = hitObject as ISpinnableObject;

        extras.push(HitObjectEncoder.encodeEndTimeData(spinner));
      }
      else if (hitObject.hitType & HitType.Hold) {
        const hold = hitObject as IHoldableObject;

        extras.push(HitObjectEncoder.encodeEndTimeData(hold));
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

  static encodePathData(slider: ISlidableObject, offset: Vector2): string {
    // curveType|curvePoints,slides,length,edgeSounds,edgeSets

    const path: string[] = [];

    let lastType: PathType;

    slider.path.controlPoints.forEach((point, i) => {
      if (point.type !== null) {
        /**
         * We've reached a new (explicit) segment!
         * 
         * Explicit segments have a new format in which the type is injected
         * into the middle of the control point string.
         * To preserve compatibility with osu-stable as much as possible,
         * explicit segments with the same type are converted
         * to use implicit segments by duplicating the control point.
         * One exception are consecutive perfect curves, which aren't supported
         * in osu!stable and can lead to decoding issues if encoded as implicit segments
         */
        let needsExplicitSegment = point.type !== lastType
          || point.type === PathType.PerfectCurve;

        /**
         * Another exception to this is when the last two control points
         * of the last segment were duplicated. This is not a scenario supported by osu!stable.
         * Lazer does not add implicit segments for the last two control points
         * of any explicit segment, so an explicit segment is forced
         * in order to maintain consistency with the decoder.
         */
        if (i > 1) {
          // We need to use the absolute control point position to determine equality, otherwise floating point issues may arise.
          const p1 = offset.add(slider.path.controlPoints[i - 1].position);
          const p2 = offset.add(slider.path.controlPoints[i - 2].position);

          if (~~p1.x === ~~p2.x && ~~p1.y === ~~p2.y) {
            needsExplicitSegment = true;
          }
        }

        if (needsExplicitSegment) {
          path.push(slider.path.curveType);
          lastType = point.type;
        }
        else {
          // New segment with the same type - duplicate the control point
          path.push(`${offset.x + point.position.x}:${offset.y + point.position.y}`);
        }
      }

      if (i !== 0) {
        path.push(`${offset.x + point.position.x}:${offset.y + point.position.y}`);
      }
    });

    const data: string[] = [];

    data.push(path.join('|'));

    /**
     * osu!stable treated the first span of the slider as a repeat,
     * but no repeats are happening.
     */
    data.push((slider.repeats + 1).toString());
    data.push(slider.distance.toString());

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

    data.push(adds.join('|'));
    data.push(sets.map((set) => set.join(':')).join('|'));

    return data.join(',');
  }

  static encodeEndTimeData(hitObject: IHasDuration): string {
    // endTime

    return hitObject.endTime.toString();
  }
}
