import {CLIError, ExitableError} from './cli'

export class ExitError extends CLIError implements ExitableError {
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
