import { ParameterCommand } from './ParameterCommand';
import { ParameterType } from '../Enums/ParameterType';

/**
 * The blending command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class BlendingCommand extends ParameterCommand {
  parameter: ParameterType = ParameterType.BlendingMode;

  /**
   * The parameter acronym of the blending command.
   */
  get parameterAcronym(): string {
    return 'A';
  }
}
