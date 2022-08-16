import { EasingType } from './EasingType';

export type EasingFn = (time: number) => number;

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
    case EasingType.OutElasticHalf: return outHalfElastic;
    case EasingType.OutElasticQuarter: return outQuartElastic;
    case EasingType.InOutElastic: return inOutElastic;
    case EasingType.InBack: return inBack;
    case EasingType.OutBack: return outBack;
    case EasingType.InOutBack: return inOutBack;
    case EasingType.InBounce: return inBounce;
    case EasingType.OutBounce: return outBounce;
    case EasingType.InOutBounce: return inOutBounce;
  }

  return linear;
}

export function linear(time: number): number {
  return time;
}

export function inQuad(time: number): number {
  return time * time;
}

export function outQuad(time: number): number {
  return -time * (time - 2);
}

export function inOutQuad(time: number): number {
  if (time < 0.5) {
    return 2 * time * time;
  }

  time = 2 * time - 1;

  return -0.5 * (time * (time - 2) - 1);
}

export function inCubic(time: number): number {
  return time * time * time;
}

export function outCubic(time: number): number {
  time -= 1;

  return time * time * time + 1;
}

export function inOutCubic(time: number): number {
  time *= 2;

  if (time < 1) {
    return 0.5 * time * time * time;
  }

  time -= 2;

  return 0.5 * (time * time * time + 2);
}

export function inQuart(time: number): number {
  return time * time * time * time;
}

export function outQuart(time: number): number {
  time -= 1;

  return -(time * time * time * time - 1);
}

export function inOutQuart(time: number): number {
  time *= 2;

  if (time < 1) {
    return 0.5 * time * time * time * time;
  }

  time -= 2;

  return -0.5 * (time * time * time * time - 2);
}

export function inQuint(time: number): number {
  return time * time * time * time * time;
}

export function outQuint(time: number): number {
  time -= 1;

  return time * time * time * time * time + 1;
}

export function inOutQuint(time: number): number {
  time *= 2;

  if (time < 1) {
    return 0.5 * time * time * time * time * time;
  }

  time -= 2;

  return 0.5 * (time * time * time * time * time + 2);
}

export function inSine(time: number): number {
  return -1 * Math.cos(time * Math.PI / 2) + 1;
}

export function outSine(time: number): number {
  return Math.sin(time * Math.PI / 2);
}

export function inOutSine(time: number): number {
  return -0.5 * (Math.cos(Math.PI * time) - 1);
}

export function inExpo(time: number): number {
  return time === 0 ? 0 : Math.pow(2, 10 * (time - 1));
}

export function outExpo(time: number): number {
  return time === 1 ? 1 : 1 - Math.pow(2, -10 * time);
}

export function inOutExpo(time: number): number {
  if (time === 0) return 0;
  if (time === 1) return 1;

  return time < 0.5
    ? 0.5 * Math.pow(2, (20 * time) - 10)
    : 1 - 0.5 * Math.pow(2, (-20 * time) + 10);
}

export function inCirc(time: number): number {
  return -1 * (Math.sqrt(1 - time * time) - 1);
}

export function outCirc(time: number): number {
  time -= 1;

  return Math.sqrt(1 - (time * time));
}

export function inOutCirc(time: number): number {
  time *= 2;

  if (time < 1) {
    return -0.5 * (Math.sqrt(1 - time * time) - 1);
  }

  time -= 2;

  return 0.5 * (Math.sqrt(1 - time * time) + 1);
}

export function inElastic(time: number): number {
  return _inElasticFunction(0.5)(time);
}

export function outElastic(time: number): number {
  return _outElasticFunction(0.5, 1)(time);
}

export function outHalfElastic(time: number): number {
  return _outElasticFunction(0.5, 0.5)(time);
}

export function outQuartElastic(time: number): number {
  return _outElasticFunction(0.5, 0.25)(time);
}

export function inOutElastic(time: number): number {
  return _inOutElasticFunction(0.5)(time);
}

function _inElasticFunction(period: number): EasingFn {
  return (time: number): number => {
    time -= 1;

    const pow = Math.pow(2, 10 * time);
    const sin = Math.sin((time - period / 4) * (2 * Math.PI) / period);

    return -1 * (pow * sin);
  };
}

function _outElasticFunction(period: number, mod: number): EasingFn {
  return (time: number): number => {
    const pow = Math.pow(2, -10 * time);
    const sin = Math.sin((mod * time - period / 4) * (2 * Math.PI / period));

    return pow * sin + 1;
  };
}

function _inOutElasticFunction(period: number): EasingFn {
  return (time: number): number => {
    time *= 2;

    if (time < 1) {
      time -= 1;

      const pow = Math.pow(2, 10 * time);
      const sin = Math.sin((time - period / 4) * 2 * Math.PI / period);

      return -0.5 * pow * sin;
    }

    time -= 1;

    const pow = Math.pow(2, -10 * time);
    const sin = Math.sin((time - period / 4) * 2 * Math.PI / period);

    return pow * sin * 0.5 + 1;
  };
}

export function inBack(time: number): number {
  const s = 1.70158;

  return time * time * ((s + 1) * time - s);
}

export function outBack(time: number): number {
  const s = 1.70158;

  time -= 1;

  return time * time * ((s + 1) * time + s) + 1;
}

export function inOutBack(time: number): number {
  let s = 1.70158;

  time *= 2;

  if (time < 1) {
    s *= 1.525;

    return 0.5 * (time * time * ((s + 1) * time - s));
  }

  time -= 2;
  s *= 1.525;

  return 0.5 * (time * time * ((s + 1) * time + s) + 2);
}

export function inBounce(time: number): number {
  return 1 - outBounce(1 - time);
}

export function outBounce(time: number): number {
  if (time < 4 / 11) {
    return (121 * time * time) / 16.0;
  }

  if (time < 8 / 11) {
    return (363 / 40 * time * time) - (99 / 10 * time) + 17 / 5;
  }

  if (time < 9 / 10) {
    return (4356 / 361 * time * time) - (35442 / 1805 * time) + 16061 / 1805;
  }

  return (54 / 5 * time * time) - (513 / 25 * time) + 268 / 25;
}

export function inOutBounce(time: number): number {
  return time < 0.5
    ? inBounce(2 * time) * 0.5
    : outBounce(2 * time - 1) * 0.5 + 0.5;
}

export function inSquare(time: number): number {
  return time < 1 ? 0 : 1;
}

export function outSquare(time: number): number {
  return time > 0 ? 1 : 0;
}

export function inOutSquare(time: number): number {
  return time < 0.5 ? 0 : 1;
}
