import {CLIError, OclifError} from './cli'

export class ExitError extends CLIError implements OclifError {
  oclif!: { exit: number }

  code = 'EEXIT'

  constructor(exitCode = 0) {
    super(`EEXIT: ${exitCode}`, {exit: exitCode})
  }

  render(): string {
    console.warn('`render` methods on CLIError are deprecated in favor of using pretty print functions')
    return ''
  }
}
