import { AlternatingMonoPattern } from './Data/AlternatingMonoPattern';
import { MonoStreak } from './Data/MonoStreak';
import { RepeatingHitPatterns } from './Data/RepeatingHitPatterns';

/**
 * Stores colour compression information for a {@link TaikoDifficultyHitObject}.
 */
export class TaikoDifficultyHitObjectColour {
  /**
   * The {@link MonoStreak} that encodes this note, only present 
   * if this is the first note within a {@link MonoStreak}
   */
  monoStreak: MonoStreak | null = null;

  /**
   * The {@link AlternatingMonoPattern} that encodes this note, 
   * only present if this is the first note within a {@link AlternatingMonoPattern}
   */
  alternatingMonoPattern: AlternatingMonoPattern | null = null;

  /**
   * The {@link RepeatingHitPattern} that encodes this note, 
   * only present if this is the first note within a {@link RepeatingHitPattern}
   */
  repeatingHitPattern: RepeatingHitPatterns | null = null;
}
