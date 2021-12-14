import { PatternGenerator } from './PatternGenerator';
import { Pattern } from './Pattern';

import { Note } from '../../Objects/Note';
import { Hold } from '../../Objects/Hold';

import { HitType, IHasPosition, IHoldableObject, Vector2 } from 'osu-resources';

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
      const hold = new Hold();
      const posData = this.hitObject as unknown as IHasPosition;

      hold.startTime = this.hitObject.startTime;
      hold.endTime = (this.hitObject as IHoldableObject).endTime ?? hold.startTime;
      hold.originalColumn = column;
      hold.samples = this.hitObject.samples.map((s) => s.clone());
      hold.nodeSamples = hold.nodeSamples || defaultNodeSamples;
      hold.startPosition = posData?.startPosition?.clone() ?? new Vector2(256, 192);

      pattern.addHitObject(hold);
    }
    else {
      const note = new Note();
      const posData = this.hitObject as unknown as IHasPosition;

      note.startTime = this.hitObject.startTime;
      note.originalColumn = column;
      note.samples = this.hitObject.samples.map((s) => s.clone());
      note.startPosition = posData?.startPosition?.clone() ?? new Vector2(256, 192);

      pattern.addHitObject(note);
    }

    yield pattern;
  }
}
