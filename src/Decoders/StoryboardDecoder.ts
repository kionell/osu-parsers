import { existsSync, readFileSync } from 'fs';
import { Storyboard } from 'osu-classes';
import { Decoder } from './Decoder';
import { Parsing } from '../Utils';

import {
  StoryboardGeneralDecoder,
  StoryboardEventDecoder,
  StoryboardVariableDecoder,
} from './Handlers';

/**
 * Storyboard decoder.
 */
export class StoryboardDecoder extends Decoder<Storyboard> {
  /**
   * Current section name.
   */
  private _variables: Record<string, string> = {};

  /**
   * Performs storyboard decoding from the specified .osb file.
   * @param path Path to the .osb file.
   * @returns Decoded storyboard.
   */
  decodeFromPath(path: string): Storyboard {
    if (!path.endsWith('.osb') && !path.endsWith('.osu')) {
      throw new Error('Wrong file format! Only .osb and .osu files are supported!');
    }

    if (!existsSync(path)) {
      throw new Error('File doesn\'t exists!');
    }

    const str = readFileSync(path).toString();

    return this.decodeFromString(str);
  }

  /**
   * Performs storyboard decoding from a string.
   * @param str String with storyboard data.
   * @returns Decoded storyboard.
   */
  decodeFromString(str: string): Storyboard {
    const data = str.toString()
      .replace(/\r/g, '')
      .split('\n');

    return this.decodeFromLines(data);
  }

  /**
   * Performs storyboard decoding from a string array.
   * @param data Array of split lines.
   * @returns Decoded storyboard.
   */
  decodeFromLines(data: string[]): Storyboard {
    const storyboard = new Storyboard();

    this._reset();
    this._lines = this._getLines(data);

    // Parse storyboard lines.
    for (let i = 0; i < this._lines.length; ++i) {
      this._parseLine(this._lines[i], storyboard);
    }

    storyboard.variables = this._variables;

    return storyboard;
  }

  protected _parseLine(line: string, storyboard: Storyboard): void {
    // .osu file version
    if (line.includes('osu file format v')) {
      storyboard.fileFormat = Parsing.parseInt(line.split('v')[1]);

      return;
    }

    super._parseLine(line, storyboard);
  }

  protected _parseSectionData(line: string, storyboard: Storyboard): void {
    switch (this._section) {
      case 'General':
        return StoryboardGeneralDecoder.handleLine(line, storyboard);

      case 'Events':
        return StoryboardEventDecoder.handleLine(line, storyboard);

      case 'Variables':
        return StoryboardVariableDecoder.handleLine(line, this._variables);
    }

    super._parseSectionData(line, storyboard);
  }

  protected _preprocessLine(line: string): string {
    // Preprocess variables in the current line.
    line = StoryboardVariableDecoder.decodeVariables(line, this._variables);

    return super._preprocessLine(line);
  }

  protected _reset(): void {
    super._reset();

    // Use 'Events' section by default.
    this._section = 'Events';
  }
}
