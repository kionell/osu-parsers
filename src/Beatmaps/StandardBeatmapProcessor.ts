import { BeatmapProcessor } from 'osu-classes';
import { StandardBeatmap } from './StandardBeatmap';
import { Circle, Slider, Spinner } from '../Objects';

export class StandardBeatmapProcessor extends BeatmapProcessor {
  private static readonly STACK_DISTANCE = 3;

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
    const stackDistance = StandardBeatmapProcessor.STACK_DISTANCE;

    const startIndex = 0;
    const endIndex = hitObjects.length - 1;

    let extendedEndIndex = endIndex;

    if (endIndex < hitObjects.length - 1) {
      // Extend the end index to include objects they are stacked on
      for (let i = endIndex; i >= startIndex; --i) {
        let stackBaseIndex = i;

        for (let n = stackBaseIndex + 1; n < hitObjects.length; ++n) {
          const stackBaseObject = hitObjects[stackBaseIndex];

          if (stackBaseObject instanceof Spinner) break;

          const objectN = hitObjects[n];

          if (objectN instanceof Spinner) continue;

          const endTime = (stackBaseObject as Slider).endTime || stackBaseObject.startTime;

          const stackThreshold = objectN.timePreempt * stackLeniency;

          if (objectN.startTime - endTime > stackThreshold) {
            // We are no longer within stacking range of the next object.
            break;
          }

          const distance1 = stackBaseObject.startPosition.fdistance(objectN.startPosition) < stackDistance;
          const distance2 = (stackBaseObject instanceof Slider)
            && stackBaseObject.endPosition.fdistance(objectN.startPosition) < stackDistance;

          if (distance1 || distance2) {
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

      if (objectI.stackHeight !== 0 || (objectI instanceof Spinner)) {
        continue;
      }

      const stackThreshold = objectI.timePreempt * stackLeniency;

      /**
       * If this object is a circle, then we enter this "special" case.
       * It either ends with a stack of circles only, or a stack of circles that are underneath a slider.
       * Any other case is handled by the "instanceof Slider" code below this.
       */
      if (objectI instanceof Circle) {
        while (--n >= 0) {
          const objectN = hitObjects[n];

          if (objectN instanceof Spinner) continue;

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
           * This is a special case where hticircles are moved DOWN and RIGHT (negative stacking) 
           * if they are under the *last* slider in a stacked pattern.
           *      o==o <- slider is at original location
           *       o <- hitCircle has stack of -1
           *        o <- hitCircle has stack of -2
           */
          const distanceNI = objectN.endPosition.fdistance(objectI.startPosition);

          if ((objectN instanceof Slider) && distanceNI < stackDistance) {
            const offset = objectI.stackHeight - objectN.stackHeight + 1;

            for (let j = n + 1; j <= i; ++j) {
              /**
               * For each object which was declared under this slider, 
               * we will offset it to appear *below* the slider end (rather than above).
               */
              const objectJ = hitObjects[j];
              const distanceNJ = objectN.endPosition.fdistance(objectJ.startPosition);

              if (distanceNJ < stackDistance) {
                objectJ.stackHeight -= offset;
              }
            }

            /**
             * We have hit a slider.  We should restart calculation using this as the new base.
             * Breaking here will mean that the slider still has StackCount of 0, so will be handled in the i-outer-loop.
             */
            break;
          }

          if (objectN.startPosition.fdistance(objectI.startPosition) < stackDistance) {
            /**
             * Keep processing as if there are no sliders.  If we come across a slider, this gets cancelled out.
             * NOTE: Sliders with start startPositions stacking are a special case that is also handled here.
             */

            objectN.stackHeight = objectI.stackHeight + 1;
            objectI = objectN;
          }
        }
      }
      else if (objectI instanceof Slider) {
        /**
         * We have hit the first slider in a possible stack.
         * } from this point on, we ALWAYS stack positive regardless.
         */
        while (--n >= startIndex) {
          const objectN = hitObjects[n];

          if (objectN instanceof Spinner) continue;

          if (objectI.startTime - objectN.startTime > stackThreshold) {
            // We are no longer within stacking range of the previous object.
            break;
          }

          const distance = objectN.endPosition.fdistance(objectI.startPosition);

          if (distance < stackDistance) {
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
    const stackDistance = StandardBeatmapProcessor.STACK_DISTANCE;

    for (let i = 0, len = hitObjects.length; i < len; ++i) {
      const currHitObject = hitObjects[i];

      if (currHitObject.stackHeight !== 0 && !(currHitObject instanceof Slider)) {
        continue;
      }

      let startTime = (currHitObject as Slider).endTime || currHitObject.startTime;
      let sliderStack = 0;

      for (let j = i + 1; j < len; ++j) {
        const stackThreshold = hitObjects[i].timePreempt * stackLeniency;

        if (hitObjects[j].startTime - stackThreshold > startTime) {
          break;
        }

        const pos2 = currHitObject.endPosition;

        if (hitObjects[j].startPosition.fdistance(currHitObject.startPosition) < stackDistance) {
          ++currHitObject.stackHeight;

          startTime = (hitObjects[j] as Slider).endTime || hitObjects[j].startTime;
        }
        else if (hitObjects[j].startPosition.fdistance(pos2) < stackDistance) {
          // Case for sliders - bump notes down and right, rather than up and left.
          hitObjects[j].stackHeight -= ++sliderStack;

          startTime = (hitObjects[j] as Slider).endTime || hitObjects[j].startTime;
        }
      }
    }
  }
}
