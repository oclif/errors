// tslint:disable no-console

export {handle} from './handle'
export {ExitError} from './errors/exit'
export {CLIError} from './errors/cli'
export {Logger} from './logger'
export {config} from './config'

import {config} from './config'
import {CLIError} from './errors/cli'
import {ExitError} from './errors/exit'

export function exit(code = 0) {
  throw new ExitError(code)
}

export function error(err: string | Error, options: {code?: string, exit?: number} = {}) {
  throw new CLIError(err, options)
}

export function warn(input: string | Error) {
  let err = new CLIError.Warn(input)
  console.error(err.render ? err.render() : `Warning: ${err.message}`)
  if (config.errorLogger) config.errorLogger.log(err.stack)
}
