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
   * Storyboard layers.
   */
  private _layers: Map<string, StoryboardLayer> = new Map();

  /**
   * Whether the storyboard can fall back to skin sprites 
   * in case no matching storyboard sprites are found.
   */
  useSkinSprites = false;

  /**
   * Depth of the currently front-most storyboard layer, excluding the overlay layer.
   */
  minimumLayerDepth = 0;

  constructor() {
    this.addLayer(new StoryboardLayer({ name: 'Foreground', depth: LayerType.Foreground }));
    this.addLayer(new StoryboardLayer({ name: 'Pass', depth: LayerType.Pass, visibleWhenFailing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Fail', depth: LayerType.Fail, visibleWhenPassing: false }));
    this.addLayer(new StoryboardLayer({ name: 'Background', depth: LayerType.Background }));
    this.addLayer(new StoryboardLayer({ name: 'Video', depth: LayerType.Video, masking: false }));
    this.addLayer(new StoryboardLayer({ name: 'Overlay', depth: LayerType.Overlay }));
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
