/* eslint-disable no-process-exit */
/* eslint-disable unicorn/no-process-exit */

import clean = require('clean-stack')

import {config} from './config'

export const handle = (err: any) => {
  try {
    if (!err) err = new Error('no error?')
    if (err.message === 'SIGINT') process.exit(1)
    const stack = clean(err.stack || '', {pretty: true})
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
  } catch (error) {
    console.error(err.stack)
    console.error(error.stack)
    process.exit(1)
  }
}
