import {CLIError, ExitableError} from './cli'

export class ExitError extends CLIError implements ExitableError {
  oclif!: { exit: number }

  code = 'EEXIT'

  constructor(exitCode = 0) {
    super(`EEXIT: ${exitCode}`, {exit: exitCode})
  }

  render(): string {
    return ''
  }
}
