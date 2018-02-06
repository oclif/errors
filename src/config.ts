import {Logger} from './logger'

const g = global.anycli = global.anycli || {}

export const config = {
  errorLogger: undefined as Logger | undefined,
  get debug(): string | undefined { return g.errlog },
  set debug(errlog: string | undefined) { g.errlog = errlog },
  get errlog(): string | undefined { return g.errlog },
  set errlog(errlog: string | undefined) {
    g.errlog = errlog
    if (errlog) this.errorLogger = new Logger(errlog)
    else delete this.errorLogger
  },
}
