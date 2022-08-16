import { Color4, Vector2 } from '../Types';

export class MathUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static clamp01(value: number): number {
    return this.clamp(value, 0, 1);
  }

  static map(value: number, from1: number, from2: number, to1: number, to2: number): number {
    if (value < from1) return to1;
    if (value >= from2) return to2;

    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
  }

  static map01(value: number, from1: number, from2: number): number {
    return this.map(value, from1, from2, 0, 1);
  }

  static lerp(value: number, a: number, b: number): number {
    return a * (1 - value) + b * value;
  }

  static lerpClamped(value: number, a: number, b: number, min: number, max: number): number {
    return this.lerp(this.clamp(value, min, max), a, b);
  }

  static lerpClamped01(value: number, a: number, b: number): number {
    return this.lerpClamped(value, a, b, 0, 1);
  }

  static lerpVector2(value: number, a: Vector2, b: Vector2): Vector2 {
    const x = this.lerp(value, a.x, b.x);
    const y = this.lerp(value, a.y, b.y);

    return new Vector2(x, y);
  }

  static lerpVector2Clamped(value: number, a: Vector2, b: Vector2, min: number, max: number): Vector2 {
    return this.lerpVector2(this.clamp(value, min, max), a, b);
  }

  static lerpColor4(value: number, a: Color4, b: Color4): Color4 {
    const red = this.lerp(value, a.red, b.red);
    const green = this.lerp(value, a.green, b.green);
    const blue = this.lerp(value, a.blue, b.blue);
    const alpha = this.lerp(value, a.alpha, b.alpha);

    return new Color4(red, green, blue, alpha);
  }

  static lerpColor4Clamped(value: number, a: Color4, b: Color4, min: number, max: number): Color4 {
    return this.lerpColor4(this.clamp(value, min, max), a, b);
  }

  static lerpColor4Clamped01(value: number, a: Color4, b: Color4): Color4 {
    return this.lerpColor4Clamped(value, a, b, 0, 1);
  }
}
