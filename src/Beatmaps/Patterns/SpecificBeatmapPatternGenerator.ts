import { PatternGenerator } from './PatternGenerator';
import { Pattern } from './Pattern';

import { Note } from '../../Objects/Note';
import { Hold } from '../../Objects/Hold';

import { HitType, IHasPosition } from 'osu-resources';

/**
 * A pattern generator for osu!mania-specific beatmaps.
 */
export class SpecificBeatmapPatternGenerator extends PatternGenerator {
  *generate(): Generator<Pattern> {
    const startX = (this.hitObject as unknown as IHasPosition).startX;
    const column = this.getColumn(startX || 0);

    const pattern = new Pattern();

    /**
     * Osu!mania-specific beatmaps in osu!stable
     * only play samples at the start of the hold note.
     */
    const defaultNodeSamples = [this.hitObject.samples, []];

    if (this.hitObject.hitType & HitType.Hold) {
      const hold = new Hold(this.hitObject);

      hold.originalColumn = column;
      hold.nodeSamples = hold.nodeSamples || defaultNodeSamples;

      pattern.addHitObject(hold);
    }
    else {
      const note = new Note(this.hitObject);

      note.originalColumn = column;

      pattern.addHitObject(note);
    }

    yield pattern;
  }
}
