import {
  IBeatmap,
  ISlidableObject,
  HitSound,
  HitType,
  SampleSet,
  HitSample,
  Vector2,
  IHasPosition,
  PathType,
  IHasDuration,
  IHitObject,
  IHasCombo,
  IHasPath,
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

    const hitObjects = beatmap.hitObjects;

    this._mode = beatmap.mode;

    hitObjects.forEach((hitObject) => {
      const data: string[] = [];
      const positionObject = hitObject as IHitObject & IHasPosition;
      const position = positionObject.startPosition;

      /**
       * Try to get hit object position if possible.
       * Otherwise, it will be replaced with default position (256, 192).
       */
      const startPosition = new Vector2(position?.x ?? 256, position?.y ?? 192);
      const hitType = this.getObjectHitType(hitObject);

      data.push(`${startPosition},`);
      data.push(`${hitObject.startTime},`);
      data.push(`${hitType},`);
      data.push(`${this.toLegacyHitSoundType(hitObject.samples)},`);

      if (hitType & HitType.Slider) {
        const slider = hitObject as ISlidableObject;

        data.push(this.encodePathData(slider, startPosition));
      }
      else if ((hitType & HitType.Spinner) || (hitType & HitType.Hold)) {
        const durationObj = hitObject as IHitObject & IHasDuration;

        data.push(this.encodeEndTimeData(durationObj));
      }

      data.push(this.encodeSampleBank(hitObject.samples));

      encoded.push(data.join(''));
    });

    return encoded.join('\n');
  }

  static getObjectHitType(hitObject: IHitObject): HitType {
    let type = 0;

    const comboObject = hitObject as IHitObject & IHasCombo;

    if (typeof comboObject.comboOffset === 'number') {
      type |= comboObject.comboOffset << 4;

      if (comboObject.isNewCombo) {
        type |= HitType.NewCombo;
      }
    }

    const pathObject = hitObject as IHitObject & IHasPath;

    if (pathObject.path) {
      return type | HitType.Slider;
    }

    const durationObject = hitObject as IHitObject & IHasDuration;

    if (typeof durationObject.duration === 'number') {
      return type | (this._mode === 3 ? HitType.Hold : HitType.Spinner);
    }

    return type | HitType.Normal;
  }

  static encodePathData(slider: ISlidableObject, offset: Vector2): string {
    // curveType|curvePoints,slides,length,edgeSounds,edgeSets

    const data: string[] = [];

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
          data.push(`${point.type}|`);
          lastType = point.type;
        }
        else {
          // New segment with the same type - duplicate the control point
          data.push(`${offset.x + point.position.x}:${offset.y + point.position.y}|`);
        }
      }

      if (i !== 0) {
        data.push(`${offset.x + point.position.x}:${offset.y + point.position.y}`);
        data.push(`${i !== slider.path.controlPoints.length - 1 ? '|' : ','}`);
      }
    });

    /**
     * osu!stable treated the first span of the slider as a repeat,
     * but no repeats are happening.
     */
    data.push(`${slider.repeats + 1},`);
    data.push(`${slider.path.expectedDistance || slider.distance},`);

    const edgeSounds: string[] = [];
    const edgeSets: string[] = [];

    for (let i = 0; i < slider.spans + 1; ++i) {
      const delimiter = i !== slider.spans ? '|' : ',';

      if (i < slider.nodeSamples.length) {
        edgeSounds.push(`${this.toLegacyHitSoundType(slider.nodeSamples[i])}${delimiter}`);
        edgeSets.push(`${this.encodeSampleBank(slider.nodeSamples[i], true)}${delimiter}`);
      }
      else {
        edgeSounds.push(`0${delimiter}`);
        edgeSets.push(`0:0${delimiter}`);
      }
    }

    data.push(edgeSounds.join(''));
    data.push(edgeSets.join(''));

    return data.join('');
  }

  static encodeSampleBank(samples: HitSample[], banksOnly = false): string {
    // normalSet:additionSet:index:volume:filename

    const normalSample = samples.find((sample) => {
      return sample.name === HitSample.HIT_NORMAL;
    }) ?? HitSample.DEFAULT;

    const addSample = samples.find((sample) => {
      return sample.name && sample.name !== HitSample.HIT_NORMAL;
    }) ?? HitSample.DEFAULT;

    const encoded: string[] = [
      `${this.toLegacySampleBank(normalSample.bank)}:`,
      `${this.toLegacySampleBank(addSample.bank)}`,
    ];

    if (!banksOnly) {
      let customSampleBank = this.toLegacyCustomSampleBank(samples.find((s) => s.name));
      let volume = samples[0]?.volume ?? 100;

      /**
       * We want to ignore custom sample banks and volume 
       * when not encoding to the mania game mode,
       * because they cause unexpected results in the editor
       * and are already satisfied by the control points.
       */
      if (this._mode !== 3) {
        customSampleBank = 0;
        volume = 0;
      }

      encoded.push(':');
      encoded.push(`${customSampleBank}:`);
      encoded.push(`${volume}:`);
      encoded.push(samples.find((s) => s.name)?.filename ?? '');
    }

    return encoded.join('');
  }

  static encodeEndTimeData(hitObject: IHitObject & IHasDuration): string {
    // endTime

    const type = this.getObjectHitType(hitObject);
    const suffix = type === HitType.Hold ? ':' : ',';

    return `${hitObject.endTime}${suffix}`;
  }

  static toLegacyCustomSampleBank(hitSample?: HitSample): number {
    return hitSample?.customSampleBank ?? 0;
  }

  static toLegacySampleBank(bank?: string): SampleSet {
    switch (bank?.toLowerCase()) {
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
