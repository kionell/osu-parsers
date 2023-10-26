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
  IHitObject,
} from 'osu-classes';

/**
 * An encoder for beatmap hit objects.
 */
export abstract class BeatmapHitObjectEncoder {
  static _mode = 0;

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

    this._mode = beatmap.mode;

    hitObjects.forEach((hitObject) => {
      const general: string[] = [];
      const positionObject = hitObject as IHitObject & IHasPosition;
      const position = positionObject.startPosition;

      /**
       * Try to get hit object position if possible.
       * Otherwise, it will be replaced with default position (256, 192).
       */
      const startPosition = new Vector2(position?.x ?? 256, position?.y ?? 192);

      if (this._mode === 3) {
        const totalColumns = Math.trunc(Math.max(1, difficulty.circleSize));
        const multiplier = Math.fround(512 / totalColumns);

        startPosition.x = Math.ceil(positionObject.startX * multiplier);
      }

      general.push(`${startPosition}`);
      general.push(`${hitObject.startTime}`);
      general.push(`${hitObject.hitType}`);
      general.push(`${hitObject.hitSound}`);

      const extras: string[] = [];

      if (hitObject.hitType & HitType.Slider) {
        const slider = hitObject as ISlidableObject;

        extras.push(this.encodePathData(slider, startPosition));
      }
      else if (hitObject.hitType & HitType.Spinner) {
        const spinner = hitObject as ISpinnableObject;

        extras.push(this.encodeEndTimeData(spinner));
      }
      else if (hitObject.hitType & HitType.Hold) {
        const hold = hitObject as IHoldableObject;

        extras.push(this.encodeEndTimeData(hold));
      }

      extras.push(this.encodeSampleBank(hitObject.samples));

      const generalLine = general.join(',');

      const extrasLine = hitObject.hitType & HitType.Hold
        ? extras.join(':')
        : extras.join(',');

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

    const edgeSounds: string[] = [];
    const edgeSets: string[] = [];

    for (let i = 0; i < slider.spans + 1; ++i) {
      edgeSounds.push(`${this.toLegacyHitSoundType(slider.nodeSamples[i])}`);
      edgeSets.push(this.encodeSampleBank(slider.nodeSamples[i], true));
    }

    data.push(edgeSounds.join('|'));
    data.push(edgeSets.join('|'));

    return data.join(',');
  }

  static encodeSampleBank(samples: HitSample[], banksOnly = false): string {
    // normalSet:additionSet:index:volume:filename

    const normalSample = samples.find((sample) => {
      return sample.name === HitSample.HIT_NORMAL;
    });

    const addSample = samples.find((sample) => {
      return sample.name && sample.name !== HitSample.HIT_NORMAL;
    });

    const encoded: string[] = [
      `${this.toLegacySampleSet(normalSample?.bank)}`,
      `${this.toLegacySampleSet(addSample?.bank)}`,
    ];

    if (!banksOnly) {
      let customIndex = this.toLegacyCustomIndex(samples.find((s) => s.name));
      let volume = samples[0]?.volume ?? 100;

      /**
       * We want to ignore custom sample banks and volume 
       * when not encoding to the mania game mode,
       * because they cause unexpected results in the editor
       * and are already satisfied by the control points.
       */
      if (this._mode !== 3) {
        customIndex = 0;
        volume = 0;
      }

      encoded.push(`${customIndex}`);
      encoded.push(`${volume}`);
      encoded.push(samples.find((s) => s.name)?.filename ?? '');
    }

    return encoded.join(':');
  }

  static encodeEndTimeData(hitObject: IHasDuration): string {
    // endTime

    return hitObject.endTime.toString();
  }

  static toLegacyCustomIndex(hitSample?: HitSample): number {
    return hitSample?.customBankIndex ?? 0;
  }

  static toLegacySampleSet(sampleBank?: string): SampleSet {
    switch (sampleBank?.toLowerCase()) {
      case HitSample.BANK_NORMAL:
        return SampleSet.Normal;

      case HitSample.BANK_SOFT:
        return SampleSet.Soft;

      case HitSample.BANK_DRUM:
        return SampleSet.Drum;

      default:
        return SampleSet.None;
    }
  }

  static toLegacyHitSoundType(samples?: HitSample[]): HitSound {
    let type = HitSound.None;

    samples?.forEach((sample) => {
      switch (sample.name) {
        case HitSample.HIT_WHISTLE:
          type |= HitSound.Whistle;
          break;

        case HitSample.HIT_FINISH:
          type |= HitSound.Finish;
          break;

        case HitSample.HIT_CLAP:
          type |= HitSound.Clap;
          break;
      }
    });

    return type;
  }
}
