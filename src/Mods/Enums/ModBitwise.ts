/**
 * Bitwise flags of all mods.
 */
export enum ModBitwise {
  None = 0,
  NoFail = 1,
  Easy = 2,
  TouchDevice = 4,
  Hidden = 8,
  HardRock = 16,
  SuddenDeath = 32,
  DoubleTime = 64,
  Relax = 128,
  HalfTime = 256,
  Nightcore = 512, // Only set along with DoubleTime. i.e: NC only gives 576
  Flashlight = 1024,
  Autoplay = 2048,
  SpunOut = 4096,
  Relax2 = 8192, // Autopilot
  Perfect = 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416
  Key4 = 32768,
  Key5 = 65536,
  Key6 = 131072,
  Key7 = 262144,
  Key8 = 524288,
  FadeIn = 1048576,
  Random = 2097152,
  Cinema = 4194304,
  Target = 8388608,
  Key9 = 16777216,
  KeyCoop = 33554432,
  Key1 = 67108864,
  Key3 = 134217728,
  Key2 = 268435456,
  ScoreV2 = 536870912,
  Mirror = 1073741824,

  KeyMod = ModBitwise.Key1 |
    ModBitwise.Key2 |
    ModBitwise.Key3 |
    ModBitwise.Key4 |
    ModBitwise.Key5 |
    ModBitwise.Key6 |
    ModBitwise.Key7 |
    ModBitwise.Key8 |
    ModBitwise.Key9,

  DifficultyDecrease = ModBitwise.Easy | ModBitwise.HalfTime,
  DifficultyIncrease = ModBitwise.HardRock |
    ModBitwise.DoubleTime |
    ModBitwise.Nightcore |
    ModBitwise.Flashlight,
}
