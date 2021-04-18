import { NestedType } from './Enums/NestedType';

/**
 * A nested event.
 */
export interface INestedEvent {
  /**
   * The type of event.
   */
  nestedType: NestedType;

  /**
   * The zero-based index of the span. In the case of repeat sliders, 
   * this will increase after each slider repeat.
   */
  spanIndex?: number;

  /**
   * The time at which the contained span index begins.
   */
  spanStartTime?: number;

  /**
   * The time at which this nested event starts.
   */
  startTime: number;

  /**
   * The progress along the slider's path at which this event occurs.
   */
  progress: number;
}
