// tslint:disable no-implicit-dependencies

import Chalk from 'chalk'
import Clean = require('clean-stack')
import Indent = require('indent-string')
import * as Wrap from 'wrap-ansi'

import {config} from '../config'
import {PrettyPrintableError} from './pretty-print'

export interface ExitableError {
  oclif?: {
    exit?: number | false;
  };
}

export function addOclifExitCode(error: Error & ExitableError, options?: {exit?: number | false}): ExitableError {
  error.oclif = error.oclif || {}
  error.oclif.exit = options?.exit === undefined ? 2 : options.exit
  return error
}

export class CLIError extends Error implements ExitableError {
  oclif: ExitableError['oclif']

  code?: string

  constructor(error: string, options: {exit?: number | false} & PrettyPrintableError = {}) {
    super(error)
    addOclifExitCode(this, options)
    this.code = options.code
  }

  get stack(): string {
    const clean: typeof Clean = require('clean-stack')
    return clean(super.stack!, {pretty: true})
  }

  render(): string {
    console.warn('`render` methods on CLIError are deprecated in favor of using pretty print functions')
    if (config.debug) {
      return this.stack
    }
    const wrap: typeof Wrap = require('wrap-ansi')
    const indent: typeof Indent = require('indent-string')

    let output = `${this.name}: ${this.message}`
    // eslint-disable-next-line node/no-missing-require
    output = wrap(output, require('../screen').errtermwidth - 6, {trim: false, hard: true} as any)
    output = indent(output, 3)
    output = indent(output, 1, {indent: this.bang, includeEmptyLines: true} as any)
    output = indent(output, 1)
    return output
  }

  get bang() {
    let red: typeof Chalk.red = ((s: string) => s) as any
    try {
      red = require('chalk').red
    } catch {}
    return red(process.platform === 'win32' ? '»' : '›')
  }
}

export namespace CLIError {
  export class Warn extends CLIError {
    constructor(err: string) {
      super(err)
      this.name = 'Warning'
    }

    get bang() {
      let yellow: typeof Chalk.yellow = ((s: string) => s) as any
      try {
        yellow = require('chalk').yellow
      } catch {}
      return yellow(process.platform === 'win32' ? '»' : '›')
    }
  }
}
