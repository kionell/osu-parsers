import { DifficultyRange, HitResult, HitWindows } from 'osu-resources';

export class TaikoHitWindows extends HitWindows {
  private static readonly _TAIKO_RANGES: DifficultyRange[] = [
    new DifficultyRange(HitResult.Great, 50, 35, 20),
    new DifficultyRange(HitResult.Ok, 120, 80, 50),
    new DifficultyRange(HitResult.Miss, 135, 95, 70),
  ];

  isHitResultAllowed(result: HitResult): boolean {
    switch (result) {
      case HitResult.Great:
      case HitResult.Ok:
      case HitResult.Miss:
        return true;
    }

    return false;
  }

  protected _getRanges(): DifficultyRange[] {
    return TaikoHitWindows._TAIKO_RANGES;
  }
}
