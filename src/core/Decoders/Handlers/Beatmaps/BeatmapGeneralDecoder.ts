import { Beatmap, SampleSet } from 'osu-classes';
import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for general info of a beatmap.
 */
export abstract class BeatmapGeneralDecoder {
  /**
   * Decodes beatmap general line and adds general info to a beatmap.
   * @param line General section line.
   * @param beatmap A parsed beatmap.
   * @param offset The offset to apply to all time values.
   */
  static handleLine(line: string, beatmap: Beatmap, offset: number): void {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
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
        beatmap.general.letterboxInBreaks = value === '1';
        break;

      case 'StoryFireInFront':
        beatmap.general.storyFireInFront = value === '1';
        break;

      case 'UseSkinSprites':
        beatmap.general.useSkinSprites = value === '1';
        break;

      case 'AlwaysShowPlayfield':
        beatmap.general.alwaysShowPlayfield = value === '1';
        break;

      case 'EpilepsyWarning':
        beatmap.general.epilepsyWarning = value === '1';
        break;

      case 'SpecialStyle':
        beatmap.general.specialStyle = value === '1';
        break;

      case 'WidescreenStoryboard':
        beatmap.general.widescreenStoryboard = value === '1';
        break;

      case 'SamplesMatchPlaybackRate':
        beatmap.general.samplesMatchPlaybackRate = value === '1';
    }
  }
}
