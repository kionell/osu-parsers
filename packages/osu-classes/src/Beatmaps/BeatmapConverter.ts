import { RulesetBeatmap } from './RulesetBeatmap';
import { IBeatmap } from './IBeatmap';
import { HitObject } from '../Objects';

/**
 * A beatmap converter.
 */
export abstract class BeatmapConverter {
  /**
   * Converts any beatmap from one game mode to another.
   * @param original Any kind of a beatmap.
   * @returns The converted beatmap.
   */
  convertBeatmap(beatmap: IBeatmap): RulesetBeatmap {
    const converted = this.createBeatmap();

    converted.general = beatmap.general;
    converted.editor = beatmap.editor;
    converted.difficulty = beatmap.difficulty.clone();
    converted.metadata = beatmap.metadata;
    converted.colors = beatmap.colors;
    converted.events = beatmap.events;
    converted.controlPoints = beatmap.controlPoints;
    converted.fileFormat = beatmap.fileFormat;
    converted.originalMode = beatmap.originalMode;

    /**
     * Save original beatmap as base beatmap for further convertations.
     */
    converted.base = beatmap.base ?? beatmap;

    for (const hitObject of this.convertHitObjects(converted.base)) {
      converted.hitObjects.push(hitObject);
    }

    converted.hitObjects.sort((a, b) => a.startTime - b.startTime);

    return converted;
  }

  abstract convertHitObjects(beatmap: IBeatmap): Generator<HitObject>;

  abstract createBeatmap(): RulesetBeatmap;

  abstract canConvert(beatmap: IBeatmap): boolean;
}
