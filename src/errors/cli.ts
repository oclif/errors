// tslint:disable no-implicit-dependencies

import Chalk from 'chalk'
import Clean = require('clean-stack')
import Indent = require('indent-string')
import * as Wrap from 'wrap-ansi'

import {config} from '../config'

export class CLIError extends Error {
  oclif: any
  code?: string
  originalStack?: string

  constructor(error: string | Error, options: {code?: string, exit?: number | false} = {}) {
    const defaultExit = 2
    if (error instanceof Error) {
      super(error.message)
      this.oclif = (error as any).oclif || {}
      this.oclif.exit = options.exit !== undefined ? options.exit :
          this.oclif.exit !== undefined ? this.oclif.exit : defaultExit
      this.originalStack = (error as any).originalStack || error.stack
      this.code = options.code !== undefined ? options.code : (error as any).code
    } else {
      super(error)
      this.oclif = {}
      this.oclif.exit = options.exit !== undefined ? options.exit : defaultExit
      this.code = options.code
    }
  }

  get stack(): string {
    const clean: typeof Clean = require('clean-stack')
    return clean(this.originalStack ? this.originalStack : super.stack!, {pretty: true})
  }

  render(): string {
    if (config.debug) {
      return this.stack
    }
    let wrap: typeof Wrap = require('wrap-ansi')
    let indent: typeof Indent = require('indent-string')

    let output = `${this.name}: ${this.message}`
    output = wrap(output, require('../screen').errtermwidth - 6, {trim: false, hard: true} as any)
    output = indent(output, 3)
    output = indent(output, 1, {indent: this.bang, includeEmptyLines: true} as any)
    output = indent(output, 1)
    return output
  }

  protected get bang() {
    let red: typeof Chalk.red = ((s: string) => s) as any
    try { red = require('chalk').red } catch {}
    return red(process.platform === 'win32' ? '»' : '›')
  }
}

export namespace CLIError {
  export class Warn extends CLIError {
    constructor(err: Error | string) {
      super(err)
      this.name = 'Warning'
    }

    protected get bang() {
      let yellow: typeof Chalk.yellow = ((s: string) => s) as any
      try { yellow = require('chalk').yellow } catch {}
      return yellow(process.platform === 'win32' ? '»' : '›')
    }
  }
}
