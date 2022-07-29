import { Colour } from '../../Utils';
import { BeatmapColorSection } from './BeatmapColorSection';

/**
 * A legacy beatmap colours section class.
 * Use the {@link BeatmapColorSection} instead.
 * @deprecated Since 0.10.0
 */
export class BeatmapColoursSection {
  /**
   * Additive combo colours.
   */
  comboColours: Colour[] = [];

  /**
   * Additive slider track colour.
   */
  sliderTrackColor?: Colour;

  /**
   * Slider border colour.
   */
  sliderBorderColor?: Colour;

  /**
   * Builds an instance of a legacy beatmap color section.
   * @param colors Beatmap color section of new format.
   * @constructor
   */
  constructor(colors?: BeatmapColorSection) {
    this.comboColours = colors?.comboColors ?? this.comboColours;

    if (colors?.sliderTrackColor) {
      this.sliderTrackColor = colors.sliderTrackColor;
    }

    if (colors?.sliderTrackColor) {
      this.sliderTrackColor = colors.sliderTrackColor;
    }
  }

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
