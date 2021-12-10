import { readFileSync } from 'fs';

import { Beatmap } from 'osu-resources';
import { StoryboardDecoder } from './StoryboardDecoder';

import {
  GeneralHandler,
  EditorHandler,
  MetadataHandler,
  DifficultyHandler,
  ColourHandler,
  EventHandler,
  HitObjectHandler,
  TimingPointHandler,
} from './Handlers';

/**
 * Beatmap decoder.
 */
export abstract class BeatmapDecoder {
  /**
   * Performs beatmap decoding from the specified .osu file.
   * @param path Path to the .osu file.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  static decodeFromPath(path: string, parseSb = true): ParsedBeatmap {
    if (!path.endsWith('.osu')) {
      throw new Error('Wrong file format! Only .osu files are supported!');
    }

    const str = readFileSync(path).toString();

    return BeatmapDecoder.decodeFromString(str, parseSb);
  }

  /**
   * Performs beatmap decoding from a string.
   * @param str String with beatmap data.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  static decodeFromString(str: string, parseSb = true): ParsedBeatmap {
    const data = str.toString()
      .replace(/\r/g, '')
      .split('\n');

    return BeatmapDecoder.decodeFromLines(data, parseSb);
  }

  /**
   * Performs beatmap decoding from a string array.
   * @param data Array of split lines.
   * @param parseSb Should a storyboard be parsed?
   * @returns Decoded beatmap.
   */
  static decodeFromLines(data: string[], parseSb = true): ParsedBeatmap {
    const beatmap = new ParsedBeatmap();

    let lines: string[] = [];
    let sbLines: string[] | null = null;

    // This array isn't needed if we don't parse a storyboard. 
    if (parseSb) sbLines = [];

    if (data.constructor === Array) {
      lines = data.map((l) => l.toString());
    }

    if (!lines.length) {
      throw new Error('Beatmap data not found!');
    }

    let sectionName = '';

    for (let i = 0, len = lines.length; i < len; ++i) {
      // Skip empty lines and comments.
      if (!lines[i] || lines[i].startsWith('//')) {
        continue;
      }

      // .osu file version
      if (lines[i].startsWith('osu file format v')) {
        beatmap.fileFormat = Number(lines[i].slice(17));
        continue;
      }

      // .osu file section
      if (lines[i].startsWith('[') && lines[i].endsWith(']')) {
        sectionName = lines[i].slice(1, -1);
        continue;
      }

      // Section data
      switch (sectionName) {
        case 'General':
          GeneralHandler.handleLine(lines[i], beatmap);
          break;

        case 'Editor':
          EditorHandler.handleLine(lines[i], beatmap);
          break;

        case 'Metadata':
          MetadataHandler.handleLine(lines[i], beatmap);
          break;

        case 'Difficulty':
          DifficultyHandler.handleLine(lines[i], beatmap);
          break;

        case 'Colours':
          ColourHandler.handleLine(lines[i], beatmap);
          break;

        case 'Events':
          EventHandler.handleLine(lines[i], beatmap, sbLines);
          break;

        case 'TimingPoints':
          TimingPointHandler.handleLine(lines[i], beatmap);
          break;

        case 'HitObjects': {
          const hitObject = HitObjectHandler.handleLine(lines[i]);

          beatmap.hitObjects.push(hitObject);
        }
      }
    }

    // Flush last control point group.
    TimingPointHandler.flushPendingPoints();

    // Storyboard
    if (parseSb && sbLines && sbLines.length) {
      beatmap.events.storyboard = StoryboardDecoder.decodeFromLines(sbLines);
    }

    return beatmap;
  }
}
