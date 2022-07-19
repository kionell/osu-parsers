import { IStoryboardElement } from './Elements/Types/IStoryboardElement';
import { LayerType } from './Enums/LayerType';
import { StoryboardLayer } from './StoryboardLayer';

/**
 * A beatmap storyboard.
 */
export class Storyboard {
  /**
   * The foreground layer of the storyboard.
   * @deprecated
   */
  foreground: IStoryboardElement[];

  /**
   * The pass layer of the storyboard. 
   * @deprecated
   */
  pass: IStoryboardElement[];

  /**
   * The fail layer of the storyboard.
   * @deprecated
   */
  fail: IStoryboardElement[];

  /**
   * The background layer of the storyboard.
   * @deprecated 
   */
  background: IStoryboardElement[];

  /**
   * The overlay layer of the storyboard.
   * @deprecated
   */
  overlay: IStoryboardElement[];

  /**
   * Samples of the storyboard.
   * @deprecated
   */
  samples: IStoryboardElement[];

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
    const foregroundLayer = new StoryboardLayer('Foreground', LayerType.Foreground);
    const passLayer = new StoryboardLayer('Pass', LayerType.Pass);
    const failLayer = new StoryboardLayer('Fail', LayerType.Fail);
    const backgroundLayer = new StoryboardLayer('Background', LayerType.Background);
    const videoLayer = new StoryboardLayer('Video', LayerType.Video, false);
    const overlayLayer = new StoryboardLayer('Overlay', LayerType.Overlay);

    failLayer.visibleWhenPassing = false;
    passLayer.visibleWhenFailing = false;

    this._layers.set(foregroundLayer.name, foregroundLayer);
    this._layers.set(passLayer.name, passLayer);
    this._layers.set(failLayer.name, failLayer);
    this._layers.set(backgroundLayer.name, backgroundLayer);
    this._layers.set(videoLayer.name, videoLayer);
    this._layers.set(overlayLayer.name, overlayLayer);

    // TODO: Remove this in next versions.
    this.foreground = foregroundLayer.elements;
    this.pass = passLayer.elements;
    this.fail = failLayer.elements;
    this.background = backgroundLayer.elements;
    this.overlay = overlayLayer.elements;
    this.samples = [];
  }

  /**
   * Finds a storyboard layer by its type. Otherwise returns background layer.
   * @param type The type of the storyboard layer.
   * @returns The storyboard layer.
   * @deprecated
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
      ?? new StoryboardLayer(name, --this.minimumLayerDepth);

    if (!this._layers.has(name)) this._layers.set(name, layer);

    return layer;
  }
}
