// tslint:disable no-console

export {handle} from './handle'
export {ExitError} from './errors/exit'
export {CLIError} from './errors/cli'
export {Logger} from './logger'
export {config} from './config'

import {config} from './config'
import {CLIError} from './errors/cli'
import {ExitError} from './errors/exit'
import {PrettyPrintableError} from './errors/pretty-print'

export function exit(code = 0): never {
  throw new ExitError(code)
}

function applyPrettyPrintOptions(error: Error & Partial<PrettyPrintableError>, options: PrettyPrintableError) {
  const prettyErrorKeys: (keyof PrettyPrintableError)[] = ['message', 'code', 'ref', 'suggestion']

  prettyErrorKeys.forEach(key => {
    const applyOptionsKey = !error[key] && options[key]
    if (applyOptionsKey) {
      error[key] = options[key] as any
    }
  })
}

export function error(input: string | Error, options: {exit: false} & PrettyPrintableError): void
export function error(input: string | Error, options?: {exit?: number} & PrettyPrintableError): never
export function error(input: string | Error, options: {exit?: number | false} & PrettyPrintableError = {}) {
  const err = new CLIError(input, options)
  applyPrettyPrintOptions(err, options)

  if (options.exit === false) {
    console.error(err.render ? err.render() : `Error ${err.message}`)
    if (config.errorLogger) config.errorLogger.log(err.stack)
  } else throw err
}

export function warn(input: string | Error) {
  const err = new CLIError.Warn(input)
  console.error(err.render ? err.render() : `Warning: ${err.message}`)
  if (config.errorLogger) config.errorLogger.log(err.stack)
}
