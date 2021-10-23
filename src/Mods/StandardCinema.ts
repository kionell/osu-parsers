import { Cinema, ModBitwise } from 'osu-resources';

export class StandardCinema extends Cinema {
  incompatibles: ModBitwise = ModBitwise.Relax2 | ModBitwise.SpunOut;
}
