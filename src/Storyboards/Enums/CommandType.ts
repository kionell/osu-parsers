/**
 * Types of storyboard commands.
 */
export enum CommandType {
  None = '',
  Movement = 'M',
  MovementX = 'MX',
  MovementY = 'MY',
  Fade = 'F',
  Scale = 'S',
  VectorScale = 'V',
  Rotation = 'R',

  /**
   * Use the {@link Color} property instead.
   * @deprecated Since 0.10.0
   */
  Colour = 'C',
  Color = 'C',
  Parameter = 'P',
}
