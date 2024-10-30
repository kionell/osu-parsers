export enum HitResult {
  /**
   * Indicates that the object has not been judged yet.
   */
  None,

  /**
   * Indicates that the object has been judged as a miss.
   * This miss window should determine how early a hit can be before it is considered 
   * for judgement (as opposed to being ignored as "too far in the future"). 
   * It should also define when a forced miss should be triggered (as a result of no user input in time).
   */
  Miss,
  Meh,
  Ok,
  Good,
  Great,
  Perfect,

  /**
   * Indicates small tick miss.
   */
  SmallTickMiss,

  /**
   * Indicates a small tick hit.
   */
  SmallTickHit,

  /**
   * Indicates a large tick miss.
   */
  LargeTickMiss,

  /**
   * Indicates a large tick hit.
   */
  LargeTickHit,

  /**
   * Indicates a small bonus.
   */
  SmallBonus,

  /**
   * Indicates a large bonus.
   */
  LargeBonus,

  /**
   * Indicates a miss that should be ignored for scoring purposes.
   */
  IgnoreMiss,

  /**
   * Indicates a hit that should be ignored for scoring purposes.
   */
  IgnoreHit,
}
