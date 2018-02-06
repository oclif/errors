// tslint:disable no-console

import {Logger} from './logger'

const g = global.anycli = global.anycli || {}

function displayWarnings() {
  if (process.listenerCount('warning') > 1) return
  process.on('warning', (warning: any) => {
    console.error(warning.stack)
    if (warning.detail) console.error(warning.detail)
  })
}

export const config = {
  errorLogger: undefined as Logger | undefined,
  get debug(): boolean { return !!g.debug },
  set debug(enabled: boolean) {
    g.debug = enabled
    if (enabled) displayWarnings()
  },
  get errlog(): string | undefined { return g.errlog },
  set errlog(errlog: string | undefined) {
    g.errlog = errlog
    if (errlog) this.errorLogger = new Logger(errlog)
    else delete this.errorLogger
  },
}
