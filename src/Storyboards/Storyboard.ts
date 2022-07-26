import { BeatmapColorSection } from '../Beatmaps';
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

  /**
   * Adds a new storyboard layer.
   * @param layer A storyboard layer.
   */
  addLayer(layer: StoryboardLayer): void {
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
