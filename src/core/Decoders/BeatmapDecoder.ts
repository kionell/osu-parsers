import { Beatmap } from 'osu-classes';

import {
  BeatmapGeneralDecoder,
  BeatmapEditorDecoder,
  BeatmapMetadataDecoder,
  BeatmapDifficultyDecoder,
  BeatmapEventDecoder,
  BeatmapHitObjectDecoder,
  BeatmapTimingPointDecoder,
} from './Handlers';

import { Decoder } from './Decoder';
import { StoryboardDecoder } from './StoryboardDecoder';
import { IBeatmapParsingOptions } from '../Interfaces';
import { Parsing } from '../Utils/Parsing';
import { existsSync, readFileSync, statSync } from '../Utils/FileSystem';
import { BufferLike, stringifyBuffer } from '../Utils/Buffer';
import { FileFormat } from '../Enums';

/**
 * Beatmap decoder.
 */
export class BeatmapDecoder extends Decoder<Beatmap> {
  /**
   * An offset which needs to be applied to old beatmaps (v4 and lower) 
   * to correct timing changes that were applied at a game client level.
   */
  static readonly EARLY_VERSION_TIMING_OFFSET = 24;

  /** 
   * Current offset for all time values.
   */
  protected _offset = 0;

  /**
   * Current storyboard lines.
   */
  protected _sbLines: string[] | null = null;

  /**
   * Performs beatmap decoding from the specified .osu file.
   * @param path Path to the .osu file.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @returns Decoded beatmap.
   */
  decodeFromPath(path: string, options?: boolean | IBeatmapParsingOptions): Beatmap {
    if (!path.endsWith(FileFormat.Beatmap)) {
      throw new Error(`Wrong file format! Only ${FileFormat.Beatmap} files are supported!`);
    }

    if (!existsSync(path)) {
      throw new Error('File doesn\'t exist!');
    }

    try {
      const data = readFileSync(path);
      const beatmap = this.decodeFromBuffer(data, options);

      beatmap.fileUpdateDate = statSync(path).mtime;

      return beatmap;
    }
    catch {
      throw new Error('Failed to read the file!');
    }
  }

  /**
   * Performs beatmap decoding from a data buffer.
   * @param data Buffer with beatmap data.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @returns Decoded beatmap.
   */
  decodeFromBuffer(data: BufferLike, options?: boolean | IBeatmapParsingOptions): Beatmap {
    return this.decodeFromString(stringifyBuffer(data), options);
  }

  /**
   * Performs beatmap decoding from a string.
   * @param str String with beatmap data.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @returns Decoded beatmap.
   */
  decodeFromString(str: string, options?: boolean | IBeatmapParsingOptions): Beatmap {
    str = typeof str !== 'string' ? String(str) : str;

    return this.decodeFromLines(str.split(/\r?\n/), options);
  }

  /**
   * Performs beatmap decoding from a string array.
   * @param data Array of split lines.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * @returns Decoded beatmap.
   */
  decodeFromLines(data: string[], options?: boolean | IBeatmapParsingOptions): Beatmap {
    const beatmap = new Beatmap();

    this._reset();
    this._lines = this._getLines(data);

    this._setEnabledSections(options);

    // This array isn't needed if we don't parse a storyboard. 
    this._sbLines = this._shouldParseStoryboard(options) ? [] : null;

    /**
     * There is one known case of .osu file starting with "\uFEFF" symbol
     * We need to use trim function to handle it. 
     * Beatmap: https://osu.ppy.sh/beatmapsets/310499#osu/771496
     */
    const fileFormatLine = this._lines[0].trim();

    if (!fileFormatLine.startsWith('osu file format v')) {
      throw new Error('Not a valid beatmap!');
    }

    // Parse beatmap lines.
    for (let i = 0; i < this._lines.length; ++i) {
      this._parseLine(this._lines[i], beatmap);
    }

    // Flush last control point group.
    BeatmapTimingPointDecoder.flushPendingPoints();

    // Apply default values to the all hit objects.
    for (let i = 0; i < beatmap.hitObjects.length; ++i) {
      beatmap.hitObjects[i].applyDefaults(beatmap.controlPoints, beatmap.difficulty);
    }

    // Use stable sorting to keep objects in the right order.
    beatmap.hitObjects.sort((a, b) => a.startTime - b.startTime);

    // Storyboard
    if (this._sbLines && this._sbLines.length) {
      const storyboardDecoder = new StoryboardDecoder();

      beatmap.events.storyboard = storyboardDecoder.decodeFromLines(this._sbLines);

      /**
       * Because we parsed storyboard through beatmap decoder
       * we need to copy these properties from beatmap directly.
       */
      beatmap.events.storyboard.useSkinSprites = beatmap.general.useSkinSprites;
      beatmap.events.storyboard.colors = beatmap.colors;
      beatmap.events.storyboard.fileFormat = beatmap.fileFormat;
    }

    return beatmap;
  }

  protected _parseLine(line: string, beatmap: Beatmap): void {
    // .osu file version
    if (line.includes('osu file format v')) {
      beatmap.fileFormat = Parsing.parseInt(line.split('v')[1]);

      // this._offset = beatmap.fileFormat <= 4 ? BeatmapDecoder.EARLY_VERSION_TIMING_OFFSET : 0;

      return;
    }

    super._parseLine(line, beatmap);
  }

  protected _parseSectionData(line: string, beatmap: Beatmap): void {
    switch (this._section) {
      case 'General':
        return BeatmapGeneralDecoder.handleLine(line, beatmap, this._offset);

      case 'Editor':
        return BeatmapEditorDecoder.handleLine(line, beatmap);

      case 'Metadata':
        return BeatmapMetadataDecoder.handleLine(line, beatmap);

      case 'Difficulty':
        return BeatmapDifficultyDecoder.handleLine(line, beatmap);

      case 'Events':
        return BeatmapEventDecoder.handleLine(line, beatmap, this._sbLines, this._offset);

      case 'TimingPoints':
        return BeatmapTimingPointDecoder.handleLine(line, beatmap, this._offset);

      case 'HitObjects':
        return BeatmapHitObjectDecoder.handleLine(line, beatmap, this._offset);
    }

    super._parseSectionData(line, beatmap);
  }

  /**
   * Sets current enabled sections.
   * All sections are enabled by default.
   * @param options Parsing options.
   */
  protected _setEnabledSections(options?: boolean | IBeatmapParsingOptions): void {
    super._setEnabledSections(options);

    if (typeof options === 'boolean') return;

    this._enabledSections.General = options?.parseGeneral ?? true;
    this._enabledSections.Editor = options?.parseEditor ?? true;
    this._enabledSections.Metadata = options?.parseMetadata ?? true;
    this._enabledSections.Difficulty = options?.parseDifficulty ?? true;
    this._enabledSections.Events = options?.parseEvents ?? true;
    this._enabledSections.TimingPoints = options?.parseTimingPoints ?? true;
    this._enabledSections.HitObjects = options?.parseHitObjects ?? true;
  }

  protected _shouldParseStoryboard(options?: boolean | IBeatmapParsingOptions): boolean {
    const parsingOptions = options as IBeatmapParsingOptions;
    const storyboardFlag = parsingOptions?.parseStoryboard ?? options as boolean;

    const parseSb = typeof storyboardFlag === 'boolean' ? storyboardFlag : true;
    const parseEvents = parsingOptions?.parseEvents ?? true;

    // Storyboard should be parsed only if both events and storyboard flags are enabled.
    return parseEvents && parseSb;
  }
}
