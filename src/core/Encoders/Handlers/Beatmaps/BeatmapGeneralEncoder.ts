import { SampleSet, IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap general info.
 */
export abstract class BeatmapGeneralEncoder {
  /**
   * Encodes beatmap general section.
   * @param beatmap A beatmap.
   * @returns Encoded beatmap general section.
   */
  static encodeGeneralSection(beatmap: IBeatmap): string {
    const encoded: string[] = ['[General]'];

    const general = beatmap.general;

    if (general.audioFilename) {
      encoded.push(`AudioFilename: ${general.audioFilename}`);
    }

    encoded.push(`AudioLeadIn: ${general.audioLeadIn}`);

    if (general.audioHash) {
      encoded.push(`AudioHash: ${general.audioHash}`);
    }

    encoded.push(`PreviewTime: ${general.previewTime}`);
    encoded.push(`Countdown: ${general.countdown}`);
    encoded.push(`SampleSet: ${SampleSet[general.sampleSet]}`);
    encoded.push(`StackLeniency: ${general.stackLeniency}`);
    encoded.push(`Mode: ${beatmap.mode}`);
    encoded.push(`LetterboxInBreaks: ${+general.letterboxInBreaks}`);

    if (general.storyFireInFront) {
      encoded.push(`StoryFireInFront: ${+general.storyFireInFront}`);
    }

    if (general.useSkinSprites) {
      encoded.push(`UseSkinSprites: ${+general.useSkinSprites}`);
    }

    if (general.alwaysShowPlayfield) {
      encoded.push(`AlwaysShowPlayfield: ${+general.alwaysShowPlayfield}`);
    }

    // TODO: Add enum for overlay positions.
    if (general.overlayPosition !== 'NoChange') {
      encoded.push(`OverlayPosition: ${general.overlayPosition}`);
    }

    if (general.skinPreference) {
      encoded.push(`SkinPreference: ${general.skinPreference}`);
    }

    if (general.epilepsyWarning) {
      encoded.push(`EpilepsyWarning: ${+general.epilepsyWarning}`);
    }

    if (general.countdownOffset > 0) {
      encoded.push(`CountdownOffset: ${general.countdownOffset}`);
    }

    if (beatmap.mode === 3) {
      encoded.push(`SpecialStyle: ${+general.specialStyle}`);
    }

    encoded.push(`WidescreenStoryboard: ${+general.widescreenStoryboard}`);

    if (general.samplesMatchPlaybackRate) {
      encoded.push(`SamplesMatchPlaybackRate: ${+general.samplesMatchPlaybackRate}`);
    }

    return encoded.join('\n');
  }
}
