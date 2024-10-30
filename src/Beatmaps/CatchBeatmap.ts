import { RulesetBeatmap } from 'osu-classes';

import {
  CatchHitObject,
  Fruit,
  JuiceStream,
  JuiceTinyDroplet,
  BananaShower,
} from '../Objects';

import { CatchModCombination } from '../Mods/CatchModCombination';

export class CatchBeatmap extends RulesetBeatmap {
  mods: CatchModCombination = new CatchModCombination();

  hitObjects: CatchHitObject[] = [];

  get mode(): number {
    return 2;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((c, h) => {
      if (h instanceof Fruit) return c + 1;
      if (h instanceof BananaShower) return c;

      return c + h.nestedHitObjects.reduce((c, n) => {
        return c + (n instanceof JuiceTinyDroplet ? 0 : 1);
      }, 0);
    }, 0);
  }

  get fruits(): Fruit[] {
    return this.hitObjects.filter((h) => h instanceof Fruit) as Fruit[];
  }

  get juiceStreams(): JuiceStream[] {
    return this.hitObjects.filter((h) => h instanceof JuiceStream) as JuiceStream[];
  }

  get bananaShowers(): BananaShower[] {
    return this.hitObjects.filter((h) => h instanceof BananaShower) as BananaShower[];
  }
}
