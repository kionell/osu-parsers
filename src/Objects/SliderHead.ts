import { Circle } from './Circle';

export class SliderHead extends Circle {
  clone(): SliderHead {
    const cloned = new SliderHead();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.stackHeight = this.stackHeight;
    cloned.scale = this.scale;

    return cloned;
  }
}
