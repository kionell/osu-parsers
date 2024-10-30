import { clamp01 } from '../../Utils/MathUtils';
import { EasingType } from './EasingType';

// Formulas from https://github.com/ppy/osu-framework/blob/master/osu.Framework/Graphics/Transforms/DefaultEasingFunction.cs
const ELASTIC_CONST = 2 * Math.PI / 0.3;
const ELASTIC_CONST2 = 0.3 / 4;

const BACK_CONST = 1.70158;
const BACK_CONST2 = BACK_CONST * 1.525;

const BOUNCE_CONST = 1 / 2.75;

// Constants used to fix expo and elastic curves to start/end at 0/1
const EXPO_OFFSET = Math.pow(2, -10);
const ELASTIC_OFFSET_FULL = Math.pow(2, -11);
const ELASTIC_OFFSET_HALF = Math.pow(2, -10) * Math.sin((0.5 - ELASTIC_CONST2) * ELASTIC_CONST);
const ELASTIC_OFFSET_QUARTER = Math.pow(2, -10) * Math.sin((0.25 - ELASTIC_CONST2) * ELASTIC_CONST);
const IN_OUT_ELASTIC_OFFSET = Math.pow(2, -10) * Math.sin(((1 - ELASTIC_CONST2 * 1.5) * ELASTIC_CONST) / 1.5);

export type EasingFn = (p: number) => number;

const clampEase = (fn: EasingFn): EasingFn => (p: number) => fn(clamp01(p));

export const linear = clampEase((p: number): number => p);

export const inQuad = clampEase((p: number): number => p * p);

export const outQuad = clampEase((p: number): number => p * (2 - p));

export const inOutQuad = clampEase((p: number): number => {
  if (p < 0.5) return p * p * 2;

  return --p * p * -2 + 1;
});

export const inCubic = clampEase((p: number): number => p * p * p);

export const outCubic = clampEase((p: number): number => --p * p * p + 1);

export const inOutCubic = clampEase((p: number): number => {
  if (p < 0.5) return p * p * p * 4;

  return --p * p * p * 4 + 1;
});

export const inQuart = clampEase((p: number): number => p * p * p * p);

export const outQuart = clampEase((p: number): number => 1 - --p * p * p * p);

export const inOutQuart = clampEase((p: number): number => {
  if (p < 0.5) return p * p * p * p * 8;

  return --p * p * p * p * -8 + 1;
});

export const inQuint = clampEase((p: number): number => {
  return p * p * p * p * p;
});

export const outQuint = clampEase((p: number): number => {
  return --p * p * p * p * p + 1;
});

export const inOutQuint = clampEase((p: number): number => {
  if (p < 0.5) return p * p * p * p * p * 16;

  return --p * p * p * p * p * 16 + 1;
});

export const inSine = clampEase((p: number): number => {
  return 1 - Math.cos(p * Math.PI * 0.5);
});

export const outSine = clampEase((p: number): number => {
  return Math.sin(p * Math.PI * 0.5);
});

export const inOutSine = clampEase((p: number): number => {
  return 0.5 - 0.5 * Math.cos(Math.PI * p);
});

export const inExpo = clampEase((p: number): number => {
  return Math.pow(2, 10 * (p - 1)) + EXPO_OFFSET * (p - 1);
});

export const outExpo = clampEase((p: number): number => {
  return -Math.pow(2, -10 * p) + 1 + EXPO_OFFSET * p;
});

export const inOutExpo = clampEase((p: number): number => {
  if (p < 0.5) return 0.5 * (Math.pow(2, 20 * p - 10) + EXPO_OFFSET * (2 * p - 1));

  return 1 - 0.5 * (Math.pow(2, -20 * p + 10) + EXPO_OFFSET * (-2 * p + 1));
});

export const inCirc = clampEase((p: number): number => {
  return 1 - Math.sqrt(1 - p * p);
});

export const outCirc = clampEase((p: number): number => {
  return Math.sqrt(1 - --p * p);
});

export const inOutCirc = clampEase((p: number): number => {
  if ((p *= 2) < 1) return 0.5 - 0.5 * Math.sqrt(1 - p * p);

  return 0.5 * Math.sqrt(1 - (p -= 2) * p) + 0.5;
});

export const inElastic = clampEase((p: number): number => {
  return -Math.pow(2, -10 + 10 * p) * Math.sin((1 - ELASTIC_CONST2 - p) * ELASTIC_CONST) + ELASTIC_OFFSET_FULL * (1 - p);
});

export const outElastic = clampEase((p: number): number => {
  return Math.pow(2, -10 * p) * Math.sin((p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_FULL * p;
});

export const outElasticHalf = clampEase((p: number): number => {
  return Math.pow(2, -10 * p) * Math.sin((0.5 * p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_HALF * p;
});

export const outElasticQuarter = clampEase((p: number): number => {
  return Math.pow(2, -10 * p) * Math.sin((0.25 * p - ELASTIC_CONST2) * ELASTIC_CONST) + 1 - ELASTIC_OFFSET_QUARTER * p;
});

export const inOutElastic = clampEase((p: number): number => {
  if ((p *= 2) < 1) return -0.5 * (Math.pow(2, -10 + 10 * p) * Math.sin(((1 - ELASTIC_CONST2 * 1.5 - p) * ELASTIC_CONST) / 1.5) - IN_OUT_ELASTIC_OFFSET * (1 - p));

  return 0.5 * (Math.pow(2, -10 * --p) * Math.sin(((p - ELASTIC_CONST2 * 1.5) * ELASTIC_CONST) / 1.5) - IN_OUT_ELASTIC_OFFSET * p) + 1;
});

export const inBack = clampEase((p: number): number => {
  return p * p * ((BACK_CONST + 1) * p - BACK_CONST);
});

export const outBack = clampEase((p: number): number => {
  return --p * p * ((BACK_CONST + 1) * p + BACK_CONST) + 1;
});

export const inOutBack = clampEase((p: number): number => {
  if ((p *= 2) < 1) return 0.5 * p * p * ((BACK_CONST2 + 1) * p - BACK_CONST2);

  return 0.5 * ((p -= 2) * p * ((BACK_CONST2 + 1) * p + BACK_CONST2) + 2);
});

export const inBounce = clampEase((p: number): number => {
  p = 1 - p;

  if (p < BOUNCE_CONST) return 1 - 7.5625 * p * p;
  if (p < 2 * BOUNCE_CONST) return 1 - (7.5625 * (p -= 1.5 * BOUNCE_CONST) * p + 0.75);
  if (p < 2.5 * BOUNCE_CONST) return 1 - (7.5625 * (p -= 2.25 * BOUNCE_CONST) * p + 0.9375);

  return 1 - (7.5625 * (p -= 2.625 * BOUNCE_CONST) * p + 0.984375);
});

export const outBounce = clampEase((p: number): number => {
  if (p < BOUNCE_CONST) return 7.5625 * p * p;
  if (p < 2 * BOUNCE_CONST) return 7.5625 * (p -= 1.5 * BOUNCE_CONST) * p + 0.75;
  if (p < 2.5 * BOUNCE_CONST) return 7.5625 * (p -= 2.25 * BOUNCE_CONST) * p + 0.9375;

  return 7.5625 * (p -= 2.625 * BOUNCE_CONST) * p + 0.984375;
});

export const inOutBounce = clampEase((p: number): number => {
  if (p < 0.5) return 0.5 - 0.5 * outBounce(1 - p * 2);

  return outBounce((p - 0.5) * 2) * 0.5 + 0.5;
});

export const outPow10 = clampEase((p: number): number => {
  return --p * Math.pow(p, 10) + 1;
});

export function getEasingFn(easing: EasingType): EasingFn {
  switch (easing) {
    case EasingType.In:
    case EasingType.InQuad: return inQuad;
    case EasingType.Out:
    case EasingType.OutQuad: return outQuad;
    case EasingType.InOutQuad: return inOutQuad;
    case EasingType.InCubic: return inCubic;
    case EasingType.OutCubic: return outCubic;
    case EasingType.InOutCubic: return inOutCubic;
    case EasingType.InQuart: return inQuart;
    case EasingType.OutQuart: return outQuart;
    case EasingType.InOutQuart: return inOutQuart;
    case EasingType.InQuint: return inQuint;
    case EasingType.OutQuint: return outQuint;
    case EasingType.InOutQuint: return inOutQuint;
    case EasingType.InSine: return inSine;
    case EasingType.OutSine: return outSine;
    case EasingType.InOutSine: return inOutSine;
    case EasingType.InExpo: return inExpo;
    case EasingType.OutExpo: return outExpo;
    case EasingType.InOutExpo: return inOutExpo;
    case EasingType.InCirc: return inCirc;
    case EasingType.OutCirc: return outCirc;
    case EasingType.InOutCirc: return inOutCirc;
    case EasingType.InElastic: return inElastic;
    case EasingType.OutElastic: return outElastic;
    case EasingType.OutElasticHalf: return outElasticHalf;
    case EasingType.OutElasticQuarter: return outElasticQuarter;
    case EasingType.InOutElastic: return inOutElastic;
    case EasingType.InBack: return inBack;
    case EasingType.OutBack: return outBack;
    case EasingType.InOutBack: return inOutBack;
    case EasingType.InBounce: return inBounce;
    case EasingType.OutBounce: return outBounce;
    case EasingType.InOutBounce: return inOutBounce;
    case EasingType.OutPow10: return outPow10;
  }

  return linear;
}
