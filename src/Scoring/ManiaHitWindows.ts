import { HitResult, HitWindows } from 'osu-resources';

export class ManiaHitWindows extends HitWindows {
  isHitResultAllowed(result: HitResult): boolean {
    switch (result) {
      case HitResult.Perfect:
      case HitResult.Great:
      case HitResult.Good:
      case HitResult.Ok:
      case HitResult.Meh:
      case HitResult.Miss:
        return true;
    }

    return false;
  }
}
