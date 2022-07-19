/**
 * Types of storyboard layers.
 */
export const enum LayerType {
  Overlay = -2147483648, // Min Int32 value.
  Foreground = 0,
  Pass,
  Fail,
  Background,
  Video,
  Samples,
}
