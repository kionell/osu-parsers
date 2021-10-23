import { SuddenDeath, ModBitwise } from 'osu-resources';

export class StandardSuddenDeath extends SuddenDeath {
  incompatibles: ModBitwise = ModBitwise.Relax2;
}
