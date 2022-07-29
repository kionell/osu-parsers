import { BlendingParameters } from '../Blending';
import { Command } from '../Commands/Command';
import { CommandType } from '../Enums/CommandType';
import { ParameterType } from '../Enums/ParameterType';

/**
 * The parameter command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export abstract class ParameterCommand extends Command<BlendingParameters> {
  type: CommandType = CommandType.Parameter;

  /**
   * The parameter type of the parameter command.
   */
  parameter: ParameterType = ParameterType.None;

  /**
   * The acronym of the parameter command.
   */
  get acronym(): string {
    return 'P';
  }

  abstract get parameterAcronym(): string;
}
