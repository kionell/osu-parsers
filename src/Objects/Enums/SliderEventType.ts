/**
 * Types of slider events.
 */
export enum SliderEventType {
  Tick = 1 << 0,
  LegacyLastTick = 1 << 1,
  Head = 1 << 2,
  Tail = 1 << 3,
  Repeat = 1 << 4,
}
