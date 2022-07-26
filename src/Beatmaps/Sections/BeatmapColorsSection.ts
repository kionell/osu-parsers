import { Color4 } from '../../Utils';

/**
 * A beatmap colors section.
 */
export class BeatmapColorsSection {
  /**
   * Additive combo colors.
   */
  comboColors: Color4[] = [];

  /**
   * Additive slider track color.
   */
  sliderTrackColor?: Color4;

  /**
   * Slider border color.
   */
  sliderBorderColor?: Color4;

  /**
   * Creates a copy of this beatmap colors section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapColorsSection {
    const cloned = new BeatmapColorsSection();

    cloned.comboColors = this.comboColors.map((c) => c.clone());

    if (this.sliderTrackColor) {
      cloned.sliderTrackColor = this.sliderTrackColor;
    }

    if (this.sliderBorderColor) {
      cloned.sliderBorderColor = this.sliderBorderColor;
    }

    return cloned;
  }
}
