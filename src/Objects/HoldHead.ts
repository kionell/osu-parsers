import { Note } from './Note';

export class HoldHead extends Note {
  clone(): HoldHead {
    const cloned = new HoldHead();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.originalColumn = this.originalColumn;
    cloned.column = this.column;

    return cloned;
  }
}
