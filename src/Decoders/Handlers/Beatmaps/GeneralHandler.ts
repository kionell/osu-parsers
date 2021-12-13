import { Beatmap, SampleSet } from 'osu-classes';

/**
 * A decoder for general info of a beatmap.
 */
export abstract class GeneralHandler {
  /**
   * Decodes beatmap general line and adds general info to a beatmap.
   * @param line General section line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'AudioFilename':
        beatmap.general.audioFilename = value;
        break;

      case 'AudioHash':
        beatmap.general.audioHash = value;
        break;

      case 'OverlayPosition':
        beatmap.general.overlayPosition = value;
        break;

      case 'SkinPreference':
        beatmap.general.skinPreference = value;
        break;

      case 'AudioLeadIn':
        beatmap.general.audioLeadIn = parseInt(value);
        break;

      case 'PreviewTime':
        beatmap.general.previewTime = parseInt(value);
        break;

      case 'Countdown':
        beatmap.general.countdown = parseInt(value);
        break;

      case 'StackLeniency':
        beatmap.general.stackLeniency = parseFloat(value);
        break;

      case 'Mode':
        beatmap.originalMode = parseInt(value);
        break;

      case 'CountdownOffset':
        beatmap.general.countdownOffset = parseInt(value);
        break;

      case 'SampleSet':
        beatmap.general.sampleSet = (SampleSet as any)[value];
        break;

      case 'LetterboxInBreaks':
        beatmap.general.letterboxInBreaks = !!value;
        break;

      case 'StoryFireInFront':
        beatmap.general.storyFireInFront = !!value;
        break;

      case 'UseSkinSprites':
        beatmap.general.useSkinSprites = !!value;
        break;

      case 'AlwaysShowPlayfield':
        beatmap.general.alwaysShowPlayfield = !!value;
        break;

      case 'EpilepsyWarning':
        beatmap.general.epilepsyWarning = !!value;
        break;

      case 'SpecialStyle':
        beatmap.general.specialStyle = !!value;
        break;

      case 'WidescreenStoryboard':
        beatmap.general.widescreenStoryboard = !!value;
        break;

      case 'SamplesMatchPlaybackRate':
        beatmap.general.samplesMatchPlaybackRate = !!value;
    }
  }
}
