import { CommandTimeline } from './CommandTimeline';
import { Command } from './Command';
import { BlendingParameters } from '../Blending';
import { Color4, Vector2 } from '../../Types';

/**
 * A command timeline group.
 */
export class CommandTimelineGroup {
  x = new CommandTimeline<number>();
  y = new CommandTimeline<number>();
  scale = new CommandTimeline<number>();
  vectorScale = new CommandTimeline<Vector2>();
  rotation = new CommandTimeline<number>();
  color = new CommandTimeline<Color4>();
  alpha = new CommandTimeline<number>();
  blendingParameters = new CommandTimeline<BlendingParameters>();
  flipH = new CommandTimeline<boolean>();
  flipV = new CommandTimeline<boolean>();

  readonly _timelines: CommandTimeline[];

  constructor() {
    this._timelines = [
      this.x,
      this.y,
      this.scale,
      this.vectorScale,
      this.rotation,
      this.color,
      this.alpha,
      this.blendingParameters,
      this.flipH,
      this.flipV,
    ];
  }

  get timelines(): CommandTimeline[] {
    return this._timelines;
  }

  get totalCommands(): number {
    return this._timelines.reduce((c, t) => c + t.commands.length, 0);
  }

  get commands(): Command[] {
    return this._timelines
      .flatMap((t) => t.commands)
      .sort((a, b) => a.startTime - b.startTime || a.endTime - b.endTime);
  }

  get commandsStartTime(): number {
    let min = Infinity;

    for (let i = 0; i < this._timelines.length; ++i) {
      min = Math.min(min, this._timelines[i].startTime);
    }

    return min;
  }

  get commandsEndTime(): number {
    let max = -Infinity;

    for (let i = 0; i < this._timelines.length; ++i) {
      max = Math.max(max, this._timelines[i].endTime);
    }

    return max;
  }

  get commandsDuration(): number {
    return this.commandsEndTime - this.commandsStartTime;
  }

  get startTime(): number {
    return this.commandsStartTime;
  }

  get endTime(): number {
    return this.commandsEndTime;
  }

  get duration(): number {
    return this.endTime - this.startTime;
  }

  get hasCommands(): boolean {
    for (let i = 0; i < this._timelines.length; ++i) {
      if (this._timelines[i].hasCommands) return true;
    }

    return false;
  }
}
