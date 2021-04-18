/**
 * Types of nested objects.
 */
export enum NestedType {
  Head = 1 << 0,
  Repeat = 1 << 1,
  Tail = 1 << 2,
  Tick = 1 << 3,
  LegacyLastTick = 1 << 4,
  BonusTick = 1 << 5,
  JuiceFruit = 1 << 6,
  JuiceDrop = 1 << 7,
  JuiceDroplet = 1 << 8,
}
