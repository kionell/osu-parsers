/**
 * A beatmap break event.
 */
export class BeatmapBreakEvent {
  /**
   * The time at which break event starts.
   */
  startTime: number;

  /**
   * The time at which break event ends.
   */
  endTime: number;

  /**
   * Creates a new instance of beatmap break event.
   * @param startTime The time at which break event starts.
   * @param endTime The time at which break event ends.
   */
  constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  /**
   * The duration of this beatmap break event.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * @returns Whether the beatmap break event has effects.
   */
  get hasEffect(): boolean {
    return this.duration >= 650;
  }

  /**
   * @param time The time.
   * @returns Whether beatmap break lasts at the specified time.
   */
  contains(time: number): boolean {
    return this.startTime <= time && time <= this.endTime;
  }
}
