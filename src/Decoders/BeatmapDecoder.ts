import { existsSync, readFileSync, statSync } from 'fs';

import { Beatmap } from 'osu-classes';
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
export class BeatmapDecoder {
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

    // Apply default values to the all hit objects.
    beatmap.hitObjects.forEach((h) => {
      h.applyDefaults(beatmap.controlPoints, beatmap.difficulty);
    });

    // Storyboard
    if (parseSb && sbLines && sbLines.length) {
      const storyboardDecoder = new StoryboardDecoder();

      beatmap.events.storyboard = storyboardDecoder.decodeFromLines(sbLines);
    }

    return beatmap;
  }
}
