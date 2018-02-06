// tslint:disable no-console

import clean = require('clean-stack')

import {config} from './config'

export const handle = (err: any) => {
  if (!err) err = new Error('no error?')
  let stack = clean(err.stack, {pretty: true})
  let message = stack
  if (err.anycli && err.render) message = err.render()
  if (message) console.error(message)
  process.exitCode = (err.anycli && err.anycli.exit !== undefined) ? err.anycli.exit : 1
  if (config.errorLogger) {
    config.errorLogger.log(stack)
    config.errorLogger.flush()
    .catch(console.error)
  }
}
