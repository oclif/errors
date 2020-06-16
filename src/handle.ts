/* eslint-disable no-process-exit */
/* eslint-disable unicorn/no-process-exit */
import {config} from './config'
import prettyPrint, {PrettyPrintableError} from './errors/pretty-print'
import {CLIError, ExitError} from '.'
import clean = require('clean-stack')

export const handle = (err: Error & PrettyPrintableError) => {
  try {
    if (!err) err = new Error('no error?')
    if (err.message === 'SIGINT') process.exit(1)

    const shouldPrint = !(err instanceof ExitError)
    const pretty = prettyPrint(err)
    const stack = clean(err.stack || '', {pretty: true})

    if (shouldPrint) {
      console.error(pretty ? pretty : stack)
    }
    const exitCode = ('oclif' in err && err.oclif.exit !== undefined) ? err.oclif.exit : 1
    if (config.errorLogger && err.code !== 'EEXIT') {
      if (stack) {
        config.errorLogger.log(stack)
      }

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
