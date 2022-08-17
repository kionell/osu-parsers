import { Color4, Vector2 } from '../Types';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function map(value: number, from1: number, to1: number, from2: number, to2: number): number {
  if (value < from1) return from2;
  if (value >= to1) return to2;

  return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

export function map01(value: number, from1: number, to1: number): number {
  return map(value, from1, to1, 0, 1);
}

export function lerp(value: number, a: number, b: number): number {
  return a * (1 - value) + b * value;
}

export function lerpClamped01(value: number, a: number, b: number): number {
  return lerp(clamp01(value), a, b);
}

export function lerpVector2(value: number, a: Vector2, b: Vector2): Vector2 {
  const x = lerpClamped01(value, a.x, b.x);
  const y = lerpClamped01(value, a.y, b.y);

  return new Vector2(x, y);
}

export function lerpColor4(value: number, a: Color4, b: Color4): Color4 {
  const red = lerpClamped01(value, a.red, b.red);
  const green = lerpClamped01(value, a.green, b.green);
  const blue = lerpClamped01(value, a.blue, b.blue);
  const alpha = lerpClamped01(value, a.alpha, b.alpha);

  return new Color4(red, green, blue, alpha);
}
