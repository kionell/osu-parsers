import {
  Storyboard,
  StoryboardSample,
  Command,
  Compound,
  CommandLoop,
  CommandTrigger,
  IStoryboardElement,
  IHasCommands,
  CompoundType,
  LayerType,
} from 'osu-resources';

import { readFileSync } from 'fs';

import { StoryboardHandler } from './Events/StoryboardHandler';
import { VariableHandler } from './Events/VariableHandler';

/**
 * Storyboard decoder.
 */
export abstract class StoryboardDecoder {
  /**
   * Performs storyboard decoding from the specified .osb file.
   * @param path Path to the .osb file.
   * @returns Decoded storyboard.
   */
  static decodeFromPath(path: string): Storyboard {
    if (!path.endsWith('.osb')) {
      throw new Error('Wrong file format! Only .osb files are supported!');
    }

    const str = readFileSync(path).toString();

    return StoryboardDecoder.decodeFromString(str);
  }

  /**
   * Performs storyboard decoding from a string.
   * @param str String with storyboard data.
   * @returns Decoded storyboard.
   */
  static decodeFromString(str: string): Storyboard {
    const data = str.toString()
      .replace(/\r/g, '')
      .split('\n');

    return StoryboardDecoder.decodeFromLines(data);
  }

  /**
   * Performs storyboard decoding from a string array.
   * @param data Array of split lines.
   * @returns Decoded storyboard.
   */
  static decodeFromLines(data: string[]): Storyboard {
    const storyboard = new Storyboard();

    let lines: string[] = [];

    if (data.constructor === Array) {
      lines = data.map((l) => l.toString().trimEnd());
    }

    if (!lines.length) {
      return storyboard;
    }

    // Get all variables before processing.
    storyboard.variables = VariableHandler.getVariables(lines);

    let element: IStoryboardElement | IHasCommands | undefined;
    let compound: CommandLoop | CommandTrigger | undefined;
    let command: Command;

    for (let i = 0, len = lines.length; i < len; ++i) {
      // Skip empty lines and comments.
      if (!lines[i] || lines[i].startsWith('//')) {
        continue;
      }

      // .osb file section
      if (lines[i].startsWith('[') && lines[i].endsWith(']')) {
        continue;
      }

      // Preprocess variables in the current line.
      lines[i] = VariableHandler.preProcess(lines[i], storyboard.variables);

      let depth = 0;

      while (lines[i].startsWith(' ') || lines[i].startsWith('_')) {
        lines[i] = lines[i].substring(1);
        ++depth;
      }

      switch (depth) {
        // Storyboard element
        case 0:
          element = StoryboardHandler.handleElement(lines[i]);

          // Force push Samples to their own layer.
          if (element instanceof StoryboardSample) {
            storyboard.getLayer(LayerType.Samples).push(element);
            break;
          }

          storyboard.getLayer(element.layer).push(element);
          break;

        // Storyboard element command
        case 1:
          // Compound command or default command
          switch (lines[i][0]) {
            case CompoundType.Loop:
              compound = StoryboardHandler.handleLoop(lines[i]);
              (element as IHasCommands).loops.push(compound);
              break;

            case CompoundType.Trigger:
              compound = StoryboardHandler.handleTrigger(lines[i]);
              (element as IHasCommands).triggers.push(compound);
              break;

            default:
              command = StoryboardHandler.handleCommand(lines[i]);
              (element as IHasCommands).commands.push(command);
          }

          break;

        // Storyboard element compounded command
        case 2:
          command = StoryboardHandler.handleCommand(lines[i]);
          (compound as Compound).commands.push(command);
          break;
      }
    }

    return storyboard;
  }
}
