// tslint:disable no-console

export {handle} from './handle'
export {ExitError} from './errors/exit'
export {CLIError} from './errors/cli'
export {Logger} from './logger'
export {config} from './config'

import {config} from './config'
import {CLIError} from './errors/cli'
import {ExitError} from './errors/exit'

export function exit(code = 0): never {
  throw new ExitError(code)
}

export function error(input: string | Error, options: {code?: string, exit: false}): void
export function error(input: string | Error, options?: {code?: string, exit?: number}): never
export function error(input: string | Error, options: {code?: string, exit?: number | false} = {}) {
  const err = new CLIError(input, options)
  if (options.exit === false) {
    console.error(err.render ? err.render() : `Error ${err.message}`)
    if (config.errorLogger) config.errorLogger.log(err.stack)
  } else throw err
}

export function warn(input: string | Error) {
  let err = new CLIError.Warn(input)
  console.error(err.render ? err.render() : `Warning: ${err.message}`)
  if (config.errorLogger) config.errorLogger.log(err.stack)
}
