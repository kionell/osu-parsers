import { DifficultyRange, HitResult, HitWindows } from 'osu-classes';

export class StandardHitWindows extends HitWindows {
  private static readonly OSU_RANGES: DifficultyRange[] = [
    new DifficultyRange(HitResult.Great, 80, 50, 20),
    new DifficultyRange(HitResult.Ok, 140, 100, 60),
    new DifficultyRange(HitResult.Meh, 200, 150, 100),
    new DifficultyRange(HitResult.Miss, 400, 400, 400),
  ];

  isHitResultAllowed(result: HitResult): boolean {
    switch (result) {
      case HitResult.Great:
      case HitResult.Ok:
      case HitResult.Meh:
      case HitResult.Miss:
        return true;
    }

    return false;
  }

  protected _getRanges(): DifficultyRange[] {
    return StandardHitWindows.OSU_RANGES;
  }
}
