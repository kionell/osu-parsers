import { StandardBeatmap } from './StandardBeatmap';
import { Slider } from '../Objects/Slider';

import { BeatmapProcessor, HitType } from 'osu-resources';

export class StandardBeatmapProcessor extends BeatmapProcessor {
  postProcess(beatmap: StandardBeatmap): StandardBeatmap {
    super.postProcess(beatmap);

    beatmap.fileFormat >= 6
      ? this._applyStackingNew(beatmap)
      : this._applyStackingOld(beatmap);

    return beatmap;
  }

  private _applyStackingNew(beatmap: StandardBeatmap): void {
    const hitObjects = beatmap.hitObjects;
    const stackLeniency = beatmap.general.stackLeniency;

    const startIndex = 0;
    const endIndex = hitObjects.length - 1;

    let extendedEndIndex = endIndex;

    if (endIndex < hitObjects.length - 1) {
      // Extend the end index to include objects they are stacked on
      for (let i = endIndex; i >= startIndex; --i) {
        let stackBaseIndex = i;

        for (let n = stackBaseIndex + 1; n < hitObjects.length; ++n) {
          const stackBaseObject = hitObjects[stackBaseIndex];

          if (stackBaseObject.hitType & HitType.Spinner) {
            break;
          }

          const objectN = hitObjects[n];

          if (objectN.hitType & HitType.Spinner) {
            continue;
          }

          const endTime =
            (stackBaseObject as Slider).endTime || stackBaseObject.startTime;

          const stackThreshold = objectN.timePreempt * stackLeniency;

          if (objectN.startTime - endTime > stackThreshold) {
            // We are no longer within stacking range of the next object.
            break;
          }

          if (
            stackBaseObject.startPosition.distance(objectN.startPosition) < 3 ||
            stackBaseObject.endPosition.distance(objectN.startPosition) < 3
          ) {
            stackBaseIndex = n;

            // HitObjects after the specified update range haven't been reset yet
            objectN.stackHeight = 0;
          }
        }

        if (stackBaseIndex > extendedEndIndex) {
          extendedEndIndex = stackBaseIndex;

          if (extendedEndIndex === hitObjects.length - 1) {
            break;
          }
        }
      }
    }

    // Reverse pass for stack calculation.
    let extendedStartIndex = startIndex;

    for (let i = extendedEndIndex; i > startIndex; --i) {
      /**
       * We should check every note which has not yet got a stack.
       * Consider the case we have two interwound stacks and this will make sense.
       *
       * o <-1      o <-2
       *  o <-3      o <-4
       *
       * We first process starting } from 4 and handle 2,
       * then we come backwards on the i loop iteration until we reach 3 and handle 1.
       * 2 and 1 will be ignored in the i loop because they already have a stack value.
       */
      let n = i;

      let objectI = hitObjects[i];

      if (objectI.stackHeight !== 0 || objectI.hitType & HitType.Spinner) {
        continue;
      }

      const stackThreshold = objectI.timePreempt * stackLeniency;

      /**
       * If this object is a circle, then we enter this "special" case.
       * It either ends with a stack of circles only, or a stack of circles that are underneath a slider.
       * Any other case is handled by the "instanceof Slider" code below this.
       */
      if (objectI.hitType & HitType.Normal) {
        while (--n >= 0) {
          const objectN = hitObjects[n];

          if (objectN.hitType & HitType.Spinner) {
            continue;
          }

          const endTime = (objectN as Slider).endTime || objectN.startTime;

          if (objectI.startTime - endTime > stackThreshold) {
            // We are no longer within stacking range of the previous object.
            break;
          }

          // HitObjects before the specified update range haven't been reset yet
          if (n < extendedStartIndex) {
            objectN.stackHeight = 0;
            extendedStartIndex = n;
          }

          /**
           * This is a special case where hticircles are moved DOWN and RIGHT (negative stacking) if they are under the *last* slider in a stacked pattern.
           *      o==o <- slider is at original location
           *       o <- hitCircle has stack of -1
           *        o <- hitCircle has stack of -2
           */
          const distance = objectN.endPosition.distance(objectI.startPosition);

          if (objectN.hitType & HitType.Slider && distance < 3) {
            const offset = objectI.stackHeight - objectN.stackHeight + 1;

            for (let j = n + 1; j <= i; ++j) {
              // For each object which was declared under this slider, we will offset it to appear *below* the slider end (rather than above).
              const objectJ = hitObjects[j];

              if (distance < 3) {
                objectJ.stackHeight -= offset;
              }
            }

            /*
             * We have hit a slider.  We should restart calculation using this as the new base.
             * Breaking here will mean that the slider still has StackCount of 0, so will be handled in the i-outer-loop.
             */
            break;
          }

          if (objectN.startPosition.distance(objectI.startPosition) < 3) {
            /*
             * Keep processing as if there are no sliders.  If we come across a slider, this gets cancelled out.
             * NOTE: Sliders with start startPositions stacking are a special case that is also handled here.
             */

            objectN.stackHeight = objectI.stackHeight + 1;
            objectI = objectN;
          }
        }
      }
      else if (objectI.hitType & HitType.Slider) {
        /**
         * We have hit the first slider in a possible stack.
         * } from this point on, we ALWAYS stack positive regardless.
         */
        while (--n >= startIndex) {
          const objectN = hitObjects[n];

          if (objectN.hitType & HitType.Spinner) {
            continue;
          }

          if (objectI.startTime - objectN.startTime > stackThreshold) {
            // We are no longer within stacking range of the previous object.
            break;
          }

          const distance = objectN.endPosition.distance(objectI.startPosition);

          if (distance < 3) {
            objectN.stackHeight = objectI.stackHeight + 1;
            objectI = objectN;
          }
        }
      }
    }
  }

  private _applyStackingOld(beatmap: StandardBeatmap): void {
    const hitObjects = beatmap.hitObjects;
    const stackLeniency = beatmap.general.stackLeniency;

    for (let i = 0, len = hitObjects.length; i < len; ++i) {
      const currHitObject = hitObjects[i];

      if (
        currHitObject.stackHeight !== 0 &&
        !(currHitObject.hitType & HitType.Slider)
      ) {
        continue;
      }

      let startTime =
        (currHitObject as Slider).endTime || currHitObject.startTime;
      let sliderStack = 0;

      for (let j = i + 1; j < len; ++j) {
        const stackThreshold = hitObjects[i].timePreempt * stackLeniency;

        if (hitObjects[j].startTime - stackThreshold > startTime) {
          break;
        }

        const pos2 = currHitObject.endPosition;

        if (
          hitObjects[j].startPosition.distance(currHitObject.startPosition) < 3
        ) {
          ++currHitObject.stackHeight;

          startTime =
            (hitObjects[j] as Slider).endTime || hitObjects[j].startTime;
        }
        else if (hitObjects[j].startPosition.distance(pos2) < 3) {
          // Case for sliders - bump notes down and right, rather than up and left.
          hitObjects[j].stackHeight -= ++sliderStack;

          startTime = (hitObjects[j] as Slider).endTime
            || hitObjects[j].startTime;
        }
      }
    }
  }
}
