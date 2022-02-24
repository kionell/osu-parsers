import { existsSync, readFileSync, statSync } from 'fs';
import { Beatmap } from 'osu-classes';

import {
  GeneralDecoder,
  EditorDecoder,
  MetadataDecoder,
  DifficultyDecoder,
  ColourDecoder,
  EventDecoder,
  HitObjectDecoder,
  TimingPointDecoder,
} from './Handlers';

import { StoryboardDecoder } from './StoryboardDecoder';
import { Parsing } from '../Utils';

/**
 * Beatmap decoder.
 */
export class BeatmapDecoder {
  /**
   * Current section name.
   */
  private _sectionName = '';

  /** 
   * Current offset for all time values.
   */
  private _offset = 0;

  /**
   * Current beatmap lines.
   */
  private _lines: string[] | null = null;

  /**
   * Current storyboard lines.
   */
  private _sbLines: string[] | null = null;

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
    const data = str.toString()
      .replace(/\r/g, '')
      .split('\n');

    return this.decodeFromLines(data, parseSb);
  }

  /**
   * Performs beatmap decoding from a string array.
   * @param data Array of split lines.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  decodeFromLines(data: string[], parseSb = true): Beatmap {
    const beatmap = new Beatmap();

    this._lines = null;
    this._sbLines = null;

    // This array isn't needed if we don't parse a storyboard. 
    if (parseSb) this._sbLines = [];

    if (data.constructor === Array) {
      this._lines = data.map((l) => l.toString());
    }

    if (!this._lines || !this._lines.length) {
      throw new Error('Beatmap data not found!');
    }

    if (!this._lines[0].startsWith('osu file format v')) {
      throw new Error('Not a valid beatmap!');
    }

    this._offset = 0;
    this._sectionName = '';

    // Parse beatmap lines.
    this._lines.forEach((line) => this._parseLine(line, beatmap));

    // Flush last control point group.
    TimingPointDecoder.flushPendingPoints();

    // Apply default values to the all hit objects.
    beatmap.hitObjects.forEach((h) => {
      h.applyDefaults(beatmap.controlPoints, beatmap.difficulty);
    });

    // Use stable sorting to keep objects in the right order.
    beatmap.hitObjects.sort((a, b) => a.startTime - b.startTime);

    // Storyboard
    if (parseSb && this._sbLines && this._sbLines.length) {
      const storyboardDecoder = new StoryboardDecoder();

      beatmap.events.storyboard = storyboardDecoder.decodeFromLines(this._sbLines);
    }

    return beatmap;
  }

  private _parseLine(line: string, beatmap: Beatmap): void {
    // Skip empty lines and comments.
    if (!line || line.startsWith('//')) return;

    // .osu file version
    if (line.startsWith('osu file format v')) {
      beatmap.fileFormat = Parsing.parseInt(line.slice(17));

      /**
       * Beatmaps of version 4 and lower had an incorrect offset 
       * (stable has this set as 24ms off).
       */
      this._offset = beatmap.fileFormat <= 4 ? 24 : 0;

      return;
    }

    // .osu file section
    if (line.startsWith('[') && line.endsWith(']')) {
      this._sectionName = line.slice(1, -1);

      return;
    }

    try {
      // Section data
      this._parseSectionData(line, beatmap);
    }
    catch {
      return;
    }
  }

  private _parseSectionData(line: string, beatmap: Beatmap) {
    switch (this._sectionName) {
      case 'General':
        GeneralDecoder.handleLine(line, beatmap, this._offset);
        break;

      case 'Editor':
        EditorDecoder.handleLine(line, beatmap);
        break;

      case 'Metadata':
        MetadataDecoder.handleLine(line, beatmap);
        break;

      case 'Difficulty':
        DifficultyDecoder.handleLine(line, beatmap);
        break;

      case 'Colours':
        ColourDecoder.handleLine(line, beatmap);
        break;

      case 'Events':
        EventDecoder.handleLine(line, beatmap, this._sbLines, this._offset);
        break;

      case 'TimingPoints':
        TimingPointDecoder.handleLine(line, beatmap, this._offset);
        break;

      case 'HitObjects':
        HitObjectDecoder.handleLine(line, beatmap, this._offset);
    }
  }
}
