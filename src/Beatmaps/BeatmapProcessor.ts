import { HitType, IHitObject, IHasComboInformation } from '../Objects';
import { IBeatmap } from './IBeatmap';

/**
 * A beatmap processor.
 */
export abstract class BeatmapProcessor {
  /**
   * Performs beatmap pre-processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  preProcess(beatmap: IBeatmap): IBeatmap {
    type ComboObject = IHitObject & IHasComboInformation;

    const objects = beatmap.hitObjects.filter((hitObject) => {
      const comboObject = hitObject as ComboObject;

      if (typeof comboObject.comboIndex === 'number') return comboObject;
    });

    const objectsWithCombo = objects as ComboObject[];

    let lastObj: ComboObject | null = null;

    for (let i = 0; i < objectsWithCombo.length; i++) {
      const obj = objectsWithCombo[i];

      if (i === 0) {
        /**
         * First hitobject should always be marked as a new combo for sanity.
         */
        objectsWithCombo[i].hitType |= HitType.NewCombo;
        objectsWithCombo[i].isNewCombo = true;
      }

      obj.comboIndex = lastObj?.comboIndex ?? 0;
      obj.comboIndexWithOffsets = lastObj?.comboIndexWithOffsets ?? 0;
      obj.currentComboIndex = (lastObj?.currentComboIndex ?? -1) + 1;

      if (obj.isNewCombo) {
        obj.currentComboIndex = 0;
        obj.comboIndex++;
        obj.comboIndexWithOffsets += obj.comboOffset + 1;

        if (lastObj !== null) lastObj.lastInCombo = true;
      }

      lastObj = obj;
    }

    return beatmap;
  }

  /**
   * Performs beatmap post processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  postProcess(beatmap: IBeatmap): IBeatmap {
    return beatmap;
  }
}
