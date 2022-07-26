import { SampleSet } from '../../Objects/Enums/SampleSet';

/**
 * A beatmap general section.
 */
export class BeatmapGeneralSection {
  /**
   * Location of the audio file relative to the current folder.
   */
  audioFilename = '';

  /**
   * @deprecated
   */
  audioHash?: string;

  /**
   * Draw order of hit circle overlays compared to hit numbers.
   *   NoChange = use skin setting.
   *   Below = draw overlays under numbers. 
   *   Above = draw overlays on top of numbers.
   */
  overlayPosition = 'NoChange';

  /**
   * Preferred skin to use during gameplay.
   */
  skinPreference = '';

  /**
   * Milliseconds of silence before the audio starts playing.
   */
  audioLeadIn = 0;

  /**
   * Time in milliseconds when the audio preview should start.
   */
  previewTime = -1;

  /**
   * Speed of the countdown before the first hit object.
   *   0 = no countdown.
   *   1 = normal.
   *   2 = half.
   *   3 = double.
   */
  countdown = 1;

  /**
   * Multiplier for the threshold in time where 
   * hit objects placed close together stack (0–1).
   */
  stackLeniency = 0.7;

  /**
   * Time in beats that the countdown starts before the first hit object.
   */
  countdownOffset = 0;

  /**
   * Sample set that will be used if timing points 
   * do not override it (Normal, Soft, Drum).
   */
  sampleSet: SampleSet = SampleSet.Normal;

  /**
   * Whether or not breaks have a letterboxing effect.
   */
  letterboxInBreaks = false;

  /**
   * @deprecated
   */
  storyFireInFront?: boolean;

  /**
   * Whether or not the storyboard can use the user's skin images.
   */
  useSkinSprites = false;

  /**
   * @deprecated
   */
  alwaysShowPlayfield?: boolean;

  /**
   * Whether or not a warning about flashing colors 
   * should be shown at the beginning of the map.
   */
  epilepsyWarning = false;

  /**
   * Whether or not the "N+1" style key layout is used for osu!mania.
   */
  specialStyle = false;

  /**
   * Whether or not the storyboard allows widescreen viewing.
   */
  widescreenStoryboard = false;

  /**
   * Whether or not sound samples will change 
   * rate when playing with speed-changing mods.
   */
  samplesMatchPlaybackRate = false;

  /**
   * Creates a copy of this beatmap general section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapGeneralSection {
    const cloned = new BeatmapGeneralSection();

    cloned.audioFilename = this.audioFilename;

    if (this.audioHash) {
      cloned.audioHash = this.audioHash;
    }

    cloned.overlayPosition = this.overlayPosition;
    cloned.skinPreference = this.skinPreference;
    cloned.audioLeadIn = this.audioLeadIn;
    cloned.previewTime = this.previewTime;
    cloned.countdown = this.countdown;
    cloned.stackLeniency = this.stackLeniency;
    cloned.countdownOffset = this.countdownOffset;
    cloned.sampleSet = this.sampleSet;
    cloned.letterboxInBreaks = this.letterboxInBreaks;

    if (this.storyFireInFront) {
      cloned.storyFireInFront = this.storyFireInFront;
    }

    cloned.useSkinSprites = this.useSkinSprites;

    if (this.alwaysShowPlayfield) {
      cloned.alwaysShowPlayfield = this.alwaysShowPlayfield;
    }

    cloned.epilepsyWarning = this.epilepsyWarning;
    cloned.specialStyle = this.specialStyle;
    cloned.widescreenStoryboard = this.widescreenStoryboard;
    cloned.samplesMatchPlaybackRate = this.samplesMatchPlaybackRate;

    return cloned;
  }
}
