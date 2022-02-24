import { Beatmap, SampleSet } from 'osu-classes';
import { Parsing } from '../../../Utils';

/**
 * A decoder for general info of a beatmap.
 */
export abstract class GeneralDecoder {
  /**
   * Decodes beatmap general line and adds general info to a beatmap.
   * @param line General section line.
   * @param beatmap A parsed beatmap.
   * @param offset The offset to apply to all time values.
   */
  static handleLine(line: string, beatmap: Beatmap, offset: number): void {
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
        beatmap.general.audioLeadIn = Parsing.parseInt(value);
        break;

      case 'PreviewTime':
        beatmap.general.previewTime = Parsing.parseInt(value) + offset;
        break;

      case 'Countdown':
        beatmap.general.countdown = Parsing.parseInt(value);
        break;

      case 'StackLeniency':
        beatmap.general.stackLeniency = Parsing.parseFloat(value);
        break;

      case 'Mode':
        beatmap.originalMode = Parsing.parseInt(value);
        break;

      case 'CountdownOffset':
        beatmap.general.countdownOffset = Parsing.parseInt(value);
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
