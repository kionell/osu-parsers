import { Color4, Vector2 } from '../Types';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function map(value: number, from1: number, from2: number, to1: number, to2: number): number {
  if (value < from1) return to1;
  if (value >= from2) return to2;

  return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

export function map01(value: number, from1: number, from2: number): number {
  return map(value, from1, from2, 0, 1);
}

export function lerp(value: number, a: number, b: number): number {
  return a * (1 - value) + b * value;
}

export function lerpClamped(value: number, a: number, b: number, min: number, max: number): number {
  return lerp(clamp(value, min, max), a, b);
}

export function lerpClamped01(value: number, a: number, b: number): number {
  return lerpClamped(value, a, b, 0, 1);
}

export function lerpVector2(value: number, a: Vector2, b: Vector2): Vector2 {
  const x = lerp(value, a.x, b.x);
  const y = lerp(value, a.y, b.y);

  return new Vector2(x, y);
}

export function lerpVector2Clamped(value: number, a: Vector2, b: Vector2, min: number, max: number): Vector2 {
  return lerpVector2(clamp(value, min, max), a, b);
}

export function lerpColor4(value: number, a: Color4, b: Color4): Color4 {
  const red = lerp(value, a.red, b.red);
  const green = lerp(value, a.green, b.green);
  const blue = lerp(value, a.blue, b.blue);
  const alpha = lerp(value, a.alpha, b.alpha);

  return new Color4(red, green, blue, alpha);
}

export function lerpColor4Clamped(value: number, a: Color4, b: Color4, min: number, max: number): Color4 {
  return lerpColor4(clamp(value, min, max), a, b);
}

export function lerpColor4Clamped01(value: number, a: Color4, b: Color4): Color4 {
  return lerpColor4Clamped(value, a, b, 0, 1);
}
