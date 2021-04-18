import { ParameterCommand } from './ParameterCommand';
import { ParameterType } from '../Enums/ParameterType';

/**
 * The blending command.
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
