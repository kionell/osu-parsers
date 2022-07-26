/**
 * Types of storyboard commands.
 */
export const enum CommandType {
  None = '',
  Movement = 'M',
  MovementX = 'MX',
  MovementY = 'MY',
  Fade = 'F',
  Scale = 'S',
  VectorScale = 'V',
  Rotation = 'R',
  Color = 'C',
  Parameter = 'P',
}
