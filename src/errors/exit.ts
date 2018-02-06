import {CLIError} from './cli'

export class ExitError extends CLIError {
  anycli!: { exit: number }
  code = 'EEXIT'

  constructor(exitCode = 0) {
    super(`EEXIT: ${exitCode}`, {exit: exitCode})
  }

  render(): string { return '' }
}
