/**
 * Types of storyboard layers.
 */
export enum LayerType {
  Background,
  Fail,
  Pass,
  Foreground,
  Overlay,

  /**
   * This layer is not supported anymore.
   * @deprecated Since 0.10.0
   */
  Samples = 5,
  Video = 5,
}
