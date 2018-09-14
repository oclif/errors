// tslint:disable no-console

import clean = require('clean-stack')

import {config} from './config'

export const handle = (err: any) => {
  try {
    if (!err) err = new Error('no error?')
    if (err.message === 'SIGINT') process.exit(1)
    let stack = clean(err.stack || '', {pretty: true})
    let message = stack
    if (err.oclif && typeof err.render === 'function') message = err.render()
    if (message) console.error(message)
    const exitCode = (err.oclif && err.oclif.exit !== undefined) ? err.oclif.exit : 1
    if (config.errorLogger && err.code !== 'EEXIT') {
      config.errorLogger.log(stack)
      config.errorLogger.flush()
        .then(() => process.exit(exitCode))
        .catch(console.error)
    } else process.exit(exitCode)
  } catch (e) {
    console.error(err.stack)
    console.error(e.stack)
    process.exit(1)
  }
}
