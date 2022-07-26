import { Color4 } from '../../Utils';

/**
 * A beatmap colours section.
 */
export class BeatmapColoursSection {
  /**
   * Additive combo colours.
   */
  comboColours: Color4[] = [];

  /**
   * Additive slider track colour.
   */
  sliderTrackColor?: Color4;

  /**
   * Slider border colour.
   */
  sliderBorderColor?: Color4;

  /**
   * Creates a copy of this beatmap colours section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapColoursSection {
    const cloned = new BeatmapColoursSection();

    cloned.comboColours = this.comboColours.map((c) => c.clone());

    if (this.sliderTrackColor) {
      cloned.sliderTrackColor = this.sliderTrackColor;
    }

    if (this.sliderBorderColor) {
      cloned.sliderBorderColor = this.sliderBorderColor;
    }

    return cloned;
  }
}
