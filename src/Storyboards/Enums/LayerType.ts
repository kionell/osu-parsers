/**
 * Types of storyboard layers.
 */
export enum LayerType {
  Background,
  Fail,
  Pass,
  Foreground,
  Overlay,
  Video,

  /**
   * This layer type is not supported anymore and will be removed soon.
   * @deprecated Since 0.10.0
   */
  Samples,
}
