// tslint:disable no-console

import Clean = require('clean-stack')
export {handle} from './handle'
export {ExitError} from './errors/exit'
export {CLIError} from './errors/cli'
export {Logger} from './logger'
export {config} from './config'

import {config} from './config'
import {CLIError} from './errors/cli'

export function error(err: string | Error, options: {code?: string, exit?: number} = {}) {
  throw new CLIError(err, options)
}

export function warn(input: string | Error) {
  let err = new CLIError.Warn(input)
  console.error(err.render())
  const clean: typeof Clean = require('clean-stack')
  let stack = clean(err.stack!, {pretty: true})
  if (config.errorLogger) config.errorLogger.log(stack)
}
