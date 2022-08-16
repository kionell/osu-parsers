import { EasingType } from './EasingType';

export type EasingFn = (time: number) => number;

export abstract class Easing {
  static getEasingFn(easing: EasingType): EasingFn {
    switch (easing) {
      case EasingType.In:
      case EasingType.InQuad: return this.inQuad;
      case EasingType.Out:
      case EasingType.OutQuad: return this.outQuad;
      case EasingType.InOutQuad: return this.inOutQuad;
      case EasingType.InCubic: return this.inCubic;
      case EasingType.OutCubic: return this.outCubic;
      case EasingType.InOutCubic: return this.inOutCubic;
      case EasingType.InQuart: return this.inQuart;
      case EasingType.OutQuart: return this.outQuart;
      case EasingType.InOutQuart: return this.inOutQuart;
      case EasingType.InQuint: return this.inQuint;
      case EasingType.OutQuint: return this.outQuint;
      case EasingType.InOutQuint: return this.inOutQuint;
      case EasingType.InSine: return this.inSine;
      case EasingType.OutSine: return this.outSine;
      case EasingType.InOutSine: return this.inOutSine;
      case EasingType.InExpo: return this.inExpo;
      case EasingType.OutExpo: return this.outExpo;
      case EasingType.InOutExpo: return this.inOutExpo;
      case EasingType.InCirc: return this.inCirc;
      case EasingType.OutCirc: return this.outCirc;
      case EasingType.InOutCirc: return this.inOutCirc;
      case EasingType.InElastic: return this.inElastic;
      case EasingType.OutElastic: return this.outElastic;
      case EasingType.OutElasticHalf: return this.outHalfElastic;
      case EasingType.OutElasticQuarter: return this.outQuartElastic;
      case EasingType.InOutElastic: return this.inOutElastic;
      case EasingType.InBack: return this.inBack;
      case EasingType.OutBack: return this.outBack;
      case EasingType.InOutBack: return this.inOutBack;
      case EasingType.InBounce: return this.inBounce;
      case EasingType.OutBounce: return this.outBounce;
      case EasingType.InOutBounce: return this.inOutBounce;
    }

    return this.linear;
  }

  static linear(time: number): number {
    return time;
  }

  static inQuad(time: number): number {
    return time * time;
  }

  static outQuad(time: number): number {
    return -time * (time - 2);
  }

  static inOutQuad(time: number): number {
    if (time < 0.5) {
      return 2 * time * time;
    }

    time = 2 * time - 1;

    return -0.5 * (time * (time - 2) - 1);
  }

  static inCubic(time: number): number {
    return time * time * time;
  }

  static outCubic(time: number): number {
    time -= 1;

    return time * time * time + 1;
  }

  static inOutCubic(time: number): number {
    time *= 2;

    if (time < 1) {
      return 0.5 * time * time * time;
    }

    time -= 2;

    return 0.5 * (time * time * time + 2);
  }

  static inQuart(time: number): number {
    return time * time * time * time;
  }

  static outQuart(time: number): number {
    time -= 1;

    return -(time * time * time * time - 1);
  }

  static inOutQuart(time: number): number {
    time *= 2;

    if (time < 1) {
      return 0.5 * time * time * time * time;
    }

    time -= 2;

    return -0.5 * (time * time * time * time - 2);
  }

  static inQuint(time: number): number {
    return time * time * time * time * time;
  }

  static outQuint(time: number): number {
    time -= 1;

    return time * time * time * time * time + 1;
  }

  static inOutQuint(time: number): number {
    time *= 2;

    if (time < 1) {
      return 0.5 * time * time * time * time * time;
    }

    time -= 2;

    return 0.5 * (time * time * time * time * time + 2);
  }

  static inSine(time: number): number {
    return -1 * Math.cos(time * Math.PI / 2) + 1;
  }

  static outSine(time: number): number {
    return Math.sin(time * Math.PI / 2);
  }

  static inOutSine(time: number): number {
    return -0.5 * (Math.cos(Math.PI * time) - 1);
  }

  static inExpo(time: number): number {
    return time === 0 ? 0 : Math.pow(2, 10 * (time - 1));
  }

  static outExpo(time: number): number {
    return time === 1 ? 1 : 1 - Math.pow(2, -10 * time);
  }

  static inOutExpo(time: number): number {
    if (time === 0) return 0;
    if (time === 1) return 1;

    return time < 0.5
      ? 0.5 * Math.pow(2, (20 * time) - 10)
      : 1 - 0.5 * Math.pow(2, (-20 * time) + 10);
  }

  static inCirc(time: number): number {
    return -1 * (Math.sqrt(1 - time * time) - 1);
  }

  static outCirc(time: number): number {
    time -= 1;

    return Math.sqrt(1 - (time * time));
  }

  static inOutCirc(time: number): number {
    time *= 2;

    if (time < 1) {
      return -0.5 * (Math.sqrt(1 - time * time) - 1);
    }

    time -= 2;

    return 0.5 * (Math.sqrt(1 - time * time) + 1);
  }

  static inElastic(time: number): number {
    return this._inElasticFunction(0.5)(time);
  }

  static outElastic(time: number): number {
    return this._outElasticFunction(0.5, 1)(time);
  }

  static outHalfElastic(time: number): number {
    return this._outElasticFunction(0.5, 0.5)(time);
  }

  static outQuartElastic(time: number): number {
    return this._outElasticFunction(0.5, 0.25)(time);
  }

  static inOutElastic(time: number): number {
    return this._inOutElasticFunction(0.5)(time);
  }

  private static _inElasticFunction(period: number): EasingFn {
    return (time: number): number => {
      time -= 1;

      const pow = Math.pow(2, 10 * time);
      const sin = Math.sin((time - period / 4) * (2 * Math.PI) / period);

      return -1 * (pow * sin);
    };
  }

  private static _outElasticFunction(period: number, mod: number): EasingFn {
    return (time: number): number => {
      const pow = Math.pow(2, -10 * time);
      const sin = Math.sin((mod * time - period / 4) * (2 * Math.PI / period));

      return pow * sin + 1;
    };
  }

  private static _inOutElasticFunction(period: number): EasingFn {
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

  static inBack(time: number): number {
    const s = 1.70158;

    return time * time * ((s + 1) * time - s);
  }

  static outBack(time: number): number {
    const s = 1.70158;

    time -= 1;

    return time * time * ((s + 1) * time + s) + 1;
  }

  static inOutBack(time: number): number {
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

  static inBounce(time: number): number {
    return 1 - this.outBounce(1 - time);
  }

  static outBounce(time: number): number {
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

  static inOutBounce(time: number): number {
    return time < 0.5
      ? this.inBounce(2 * time) * 0.5
      : this.outBounce(2 * time - 1) * 0.5 + 0.5;
  }

  static inSquare(time: number): number {
    return time < 1 ? 0 : 1;
  }

  static outSquare(time: number): number {
    return time > 0 ? 1 : 0;
  }

  static inOutSquare(time: number): number {
    return time < 0.5 ? 0 : 1;
  }
}
