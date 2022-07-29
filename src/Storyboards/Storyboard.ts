import { BeatmapColorSection } from '../Beatmaps/Sections/BeatmapColorSection';
import { IStoryboardElement, IStoryboardElementWithDuration } from './Elements';
import { LayerType } from './Enums/LayerType';
import { StoryboardLayer } from './StoryboardLayer';

/**
 * A beatmap storyboard.
 */
export class Storyboard {
  /**
   * The background layer of the storyboard.
   * Use the {@link layers} getter or {@link getLayerByType} or {@link getLayerByName}.
   * @deprecated Since 0.10.0
   */
  background: IStoryboardElement[] = [];

  /**
   * The fail layer of the storyboard. 
   * Use the {@link layers} getter or {@link getLayerByType} or {@link getLayerByName}.
   * @deprecated Since 0.10.0
   */
  fail: IStoryboardElement[] = [];

  /**
   * The pass layer of the storyboard. 
   * Use the {@link layers} getter or {@link getLayerByType} or {@link getLayerByName}.
   * @deprecated Since 0.10.0
   */
  pass: IStoryboardElement[] = [];

  /**
   * The foreground layer of the storyboard. 
   * Use the {@link layers} getter or {@link getLayerByType} or {@link getLayerByName}.
   * @deprecated Since 0.10.0
   */
  foreground: IStoryboardElement[] = [];

  /**
   * The overlay layer of the storyboard. 
   * Use the {@link layers} getter or {@link getLayerByType} or {@link getLayerByName}.
   * @deprecated Since 0.10.0
   */
  overlay: IStoryboardElement[] = [];

  /**
   * Samples of the storyboard. This layer is not supported anymore.
   * All storyboard samples can be a part of any storyboard layer.
   * @deprecated Since 0.10.0
   */
  samples: IStoryboardElement[] = [];

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

    // TODO: This is temporary and needs to be removed later.
    this.addLayer(new StoryboardLayer({ name: 'Samples', depth: -1 }));

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
    this._layers.set(layer.name, layer);

    // Only for compatibility.
    switch (layer.name as keyof typeof LayerType) {
      case 'Background':
        this.background = layer.elements;
        break;

      case 'Fail':
        this.fail = layer.elements;
        break;

      case 'Pass':
        this.pass = layer.elements;
        break;

      case 'Foreground':
        this.foreground = layer.elements;
        break;

      case 'Overlay':
        this.overlay = layer.elements;
        break;

      case 'Samples':
        this.samples = layer.elements;
    }
  }

  /**
   * Finds a storyboard layer by its type.
   * Use the {@link getLayerByName} or {@link getLayerByType} methods instead.
   * @param type The type of the storyboard layer.
   * @deprecated Since 0.10.0
   * @returns The storyboard layer.
   */
  getLayer(type: LayerType): IStoryboardElement[] {
    switch (type) {
      case LayerType.Fail:
        return this.fail;

      case LayerType.Pass:
        return this.pass;

      case LayerType.Foreground:
        return this.foreground;

      case LayerType.Overlay:
        return this.overlay;

      case LayerType.Samples:
        return this.samples;
    }

    return this.background;
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
