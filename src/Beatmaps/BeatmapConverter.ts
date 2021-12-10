import { RulesetBeatmap } from './RulesetBeatmap';
import { HitObject } from '../Objects/HitObject';
import { IBeatmap } from './IBeatmap';

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

    converted.general = beatmap.general.clone();
    converted.editor = beatmap.editor.clone();
    converted.difficulty = beatmap.difficulty.clone();
    converted.metadata = beatmap.metadata.clone();
    converted.colours = beatmap.colours.clone();
    converted.events = beatmap.events.clone();
    converted.controlPoints = beatmap.controlPoints.clone();
    converted.fileFormat = beatmap.fileFormat;

    for (const hitObject of this.convertHitObjects(beatmap)) {
      converted.hitObjects.push(hitObject);
    }

    converted.hitObjects.sort((a, b) => a.startTime - b.startTime);

    return converted;
  }

  abstract convertHitObjects(beatmap: IBeatmap): Generator<HitObject>;

  abstract createBeatmap(): RulesetBeatmap;

  abstract canConvert(beatmap: IBeatmap): boolean;
}
