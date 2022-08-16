import { BeatmapColorSection } from '../Beatmaps/Sections/BeatmapColorSection';
import { IStoryboardElementWithDuration } from './Elements';
import { LayerType } from './Enums/LayerType';
import { StoryboardLayer } from './StoryboardLayer';

/**
 * A beatmap storyboard.
 */
export class Storyboard {
  /**
   * Variables of the storyboard.
   */
  variables: Record<string, string> = {};

  /**
   * Custom beatmap colors.
   */
  colors: BeatmapColorSection = new BeatmapColorSection();

  /**
   * Whether the storyboard can fall back to skin sprites 
   * in case no matching storyboard sprites are found.
   */
  useSkinSprites = false;

  /**
   * Depth of the currently front-most storyboard layer, excluding the overlay layer.
   */
  minimumLayerDepth = 0;

  /**
   * Beatmap file version for which this storyboard was created.
   */
  fileFormat = 14;

  /**
   * Storyboard layers.
   */
  private _layers: Map<string, StoryboardLayer> = new Map();

  constructor() {
    this.addLayer(new StoryboardLayer({ name: 'Video', depth: 4, masking: false }));
    this.addLayer(new StoryboardLayer({ name: 'Background', depth: 3 }));
    this.addLayer(new StoryboardLayer({ name: 'Fail', depth: 2, visibleWhenPassing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Pass', depth: 1, visibleWhenFailing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Foreground', depth: 0 }));

    // Overlay layer should always be at the front.
    this.addLayer(new StoryboardLayer({ name: 'Overlay', depth: -2147483648 }));
  }

  get layers(): Map<string, StoryboardLayer> {
    return this._layers;
  }

  get hasDrawable(): boolean {
    for (const layer of this.layers.values()) {
      if (layer.elements.find((e) => e.isDrawable)) return true;
    }

    return false;
  }

  get hasVariables(): boolean {
    for (const _ in this.variables) return true;

    return false;
  }

  /**
   * Across all layers, find the earliest point in time that a storyboard element exists at.
   * Will return null if there are no elements.
   * This iterates all elements and as such should be used sparingly or stored locally.
   */
  get earliestEventTime(): number | null {
    let time = Infinity;

    this._layers.forEach((layer) => {
      const elements = layer.elements;
      const min = elements.reduce((m, el) => Math.min(m, el.startTime), 0);

      time = Math.min(min, time);
    });

    return time === Infinity ? null : time;
  }

  /**
   * Across all layers, find the latest point in time that a storyboard element ends at.
   * Will return null if there are no elements.
   * This iterates all elements and as such should be used sparingly or stored locally.
   * Videos and samples return start time as their end time.
   */
  get latestEventTime(): number | null {
    let time = -Infinity;

    this._layers.forEach((layer) => {
      const elements = layer.elements;
      const max = elements.reduce((max, element) => {
        const durationElement = element as IStoryboardElementWithDuration;

        return Math.max(max, durationElement?.endTime ?? element.startTime);
      }, 0);

      time = Math.max(max, time);
    });

    return time === -Infinity ? null : time;
  }

  /**
   * Adds a new storyboard layer.
   * @param layer A storyboard layer.
   */
  addLayer(layer: StoryboardLayer): void {
    if (this._layers.has(layer.name)) return;

    this._layers.set(layer.name, layer);
  }

  /**
   * Finds a storyboard layer by its type. Returns background layer if type doesn't exist.
   * @param type The type of the storyboard layer.
   * @returns The storyboard layer.
   */
  getLayerByType(type: LayerType): StoryboardLayer {
    return this.getLayerByName(LayerType[type] ?? 'Background');
  }

  /**
   * Finds a storyboard layer by its name. Otherwise will create a new storyboard layer with this name.
   * @param name The name of the storyboard layer.
   * @returns The storyboard layer.
   */
  getLayerByName(name: string): StoryboardLayer {
    const layer = this._layers.get(name)
      ?? new StoryboardLayer({ name, depth: --this.minimumLayerDepth });

    if (!this._layers.has(name)) this._layers.set(name, layer);

    return layer;
  }
}
