import { Section } from '../Enums';

export class SectionMap extends Map<Section, boolean> {
  /**
   * Current section of this map.
   */
  currentSection: Section | null = null;

  /**
   * Gets the current state of the specified section.
   * @param section Section name.
   * @returns Current state of the section.
   */
  get(section: Section): boolean {
    return super.get(section) ?? false;
  }

  /**
   * Sets the state of the specified section.
   * @param section Section name.
   * @param state State of the section.
   * @returns Reference to this section map.
   */
  set(section: Section, state = true): this {
    return super.set(section, state);
  }

  /**
   * Resets all section states to enabled and removes current section.
   * @returns Reference to this section map.
   */
  reset(): this {
    this.forEach((_, key, map) => {
      map.set(key, true);
    });

    this.currentSection = null;

    return this;
  }

  get hasEnabledSections(): boolean {
    for (const state of this.values()) {
      if (state) return true;
    }

    return false;
  }

  /**
   * Check if current section is enabled and should be parsed.
   * Unknown sections are disabled by default.
   * @returns If this section is enabled.
   */
  get isSectionEnabled(): boolean {
    return this.currentSection ? this.get(this.currentSection) : false;
  }
}
