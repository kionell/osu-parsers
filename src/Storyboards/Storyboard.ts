import { IStoryboardElement } from './Elements/Types/IStoryboardElement';
import { LayerType } from './Enums/LayerType';

/**
 * A beatmap storyboard.
 */
export class Storyboard {
  /**
   * The background layer of the storyboard. 
   */
  background: IStoryboardElement[] = [];

  /**
   * The fail layer of the storyboard. 
   */
  fail: IStoryboardElement[] = [];

  /**
   * The pass layer of the storyboard. 
   */
  pass: IStoryboardElement[] = [];

  /**
   * The foreground layer of the storyboard. 
   */
  foreground: IStoryboardElement[] = [];

  /**
   * The overlay layer of the storyboard. 
   */
  overlay: IStoryboardElement[] = [];

  /**
   * Samples of the storyboard. 
   */
  samples: IStoryboardElement[] = [];

  /**
   * Variables of the storyboard. 
   */
  variables: { [key: string]: string } = {};

  /**
   * Finds a storyboard layer by its type.
   * @param type The type of the storyboard layer.
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
}
