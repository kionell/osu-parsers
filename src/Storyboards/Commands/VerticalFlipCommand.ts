import { ParameterCommand } from './ParameterCommand';
import { ParameterType } from '../Enums/ParameterType';

/**
 * The vertical flip command.
 */
export class VerticalFlipCommand extends ParameterCommand {
  /**
   * The parameter type of the vertical flip command.
   */
  parameter: ParameterType = ParameterType.VerticalFlip;

  /**
   * The parameter acronym of the vertical flip command.
   */
  get parameterAcronym(): string {
    return 'V';
  }
}
