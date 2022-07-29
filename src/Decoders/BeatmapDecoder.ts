import { existsSync, readFileSync, statSync } from 'fs';
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
import { Parsing } from '../Utils';

/**
 * Beatmap decoder.
 */
export class BeatmapDecoder extends Decoder<Beatmap> {
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
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  decodeFromPath(path: string, parseSb = true): Beatmap {
    if (!path.endsWith('.osu')) {
      throw new Error('Wrong file format! Only .osu files are supported!');
    }

    if (!existsSync(path)) {
      throw new Error('File doesn\'t exists!');
    }

    const str = readFileSync(path).toString();
    const beatmap = this.decodeFromString(str, parseSb);

    beatmap.fileUpdateDate = statSync(path).mtime;

    return beatmap;
  }

  /**
   * Performs beatmap decoding from a string.
   * @param str String with beatmap data.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  decodeFromString(str: string, parseSb = true): Beatmap {
    str = typeof str !== 'string' ? String(str) : str;

    return this.decodeFromLines(str.split('\n'), parseSb);
  }

  /**
   * Performs beatmap decoding from a string array.
   * @param data Array of split lines.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  decodeFromLines(data: string[], parseSb = true): Beatmap {
    const beatmap = new Beatmap();

    this._reset();
    this._lines = this._getLines(data);

    // This array isn't needed if we don't parse a storyboard. 
    this._sbLines = parseSb ? [] : null;

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
    if (parseSb && this._sbLines && this._sbLines.length) {
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

      /**
       * Beatmaps of version 4 and lower had an incorrect offset 
       * (stable has this set as 24ms off).
       */
      this._offset = beatmap.fileFormat <= 4 ? 24 : 0;

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
}
