import { SampleSet, IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap general info.
 */
export abstract class GeneralEncoder {
  /**
   * Encodes beatmap general section.
   * @param beatmap A beatmap.
   * @returns Encoded beatmap general section.
   */
  static encodeGeneralSection(beatmap: IBeatmap): string {
    const encoded: string[] = ['[General]'];

    const general = beatmap.general;

    encoded.push(`AudioFilename:${general.audioFilename}`);
    encoded.push(`AudioLeadIn:${general.audioLeadIn}`);

    if (general.audioHash) {
      encoded.push(`AudioHash:${general.audioHash}`);
    }

    encoded.push(`PreviewTime:${general.previewTime}`);
    encoded.push(`Countdown:${general.countdown}`);
    encoded.push(`SampleSet:${SampleSet[general.sampleSet]}`);
    encoded.push(`StackLeniency:${general.stackLeniency}`);
    encoded.push(`Mode:${beatmap.mode}`);
    encoded.push(`LetterboxInBreaks:${+general.letterboxInBreaks}`);

    if (general.storyFireInFront) {
      encoded.push(`StoryFireInFront:${+general.storyFireInFront}`);
    }

    encoded.push(`UseSkinSprites:${+general.useSkinSprites}`);

    if (general.alwaysShowPlayfield) {
      encoded.push(`AlwaysShowPlayfield:${+general.alwaysShowPlayfield}`);
    }

    encoded.push(`OverlayPosition:${general.overlayPosition}`);
    encoded.push(`SkinPreference:${general.skinPreference}`);
    encoded.push(`EpilepsyWarning:${+general.epilepsyWarning}`);
    encoded.push(`CountdownOffset:${general.countdownOffset}`);
    encoded.push(`SpecialStyle:${+general.specialStyle}`);
    encoded.push(`WidescreenStoryboard:${+general.widescreenStoryboard}`);
    encoded.push(`SamplesMatchPlaybackRate:${+general.samplesMatchPlaybackRate}`);

    return encoded.join('\n');
  }
}
