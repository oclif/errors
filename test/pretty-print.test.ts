import {expect, fancy} from 'fancy-test'
import prettyPrint, {PrettyPrintableError} from '../src/errors/pretty-print'
import {CLIError} from '../src'
const stripAnsi = require('strip-ansi')

describe('pretty-print', () => {
  fancy
  .it('pretty prints an error', async () => {
    const sampleError: Error & PrettyPrintableError = new Error('Something very serious has gone wrong with the flags!')
    sampleError.ref = 'https://oclif.io/docs/flags'
    sampleError.code = 'OCLIF_BAD_FLAG'
    sampleError.suggestion = 'Try using using a good flag'

    expect(
      stripAnsi(prettyPrint(sampleError)),
    ).to.equal(`    Error: Something very serious has gone wrong with the flags!
    Code: OCLIF_BAD_FLAG
    Suggestion: Try using using a good flag
    Reference: https://oclif.io/docs/flags`)
  })

  fancy
  .it('pretty prints with omitted fields', async () => {
    const sampleError = new Error('Something very serious has gone wrong with the flags!')

    expect(
      stripAnsi(prettyPrint(sampleError)),
    ).to.equal('    Error: Something very serious has gone wrong with the flags!')
  })

  describe('CLI Error properties', () => {
    fancy
    .it('supports the bang property', async () => {
      class SampleCLIError extends CLIError {
        get bang() {
          return '>>>'
        }
      }

      const sampleError = new SampleCLIError('This is a CLI error')
      expect(stripAnsi(prettyPrint(sampleError))).to.equal(' >>>   Error: This is a CLI error')
    })

    fancy
    .it('supports the \'name\' message prefix property', async () => {
      const defaultBang = process.platform === 'win32' ? '»' : '›'
      const sampleError = new CLIError('This is a CLI error')
      sampleError.name = 'Errorz'
      expect(stripAnsi(prettyPrint(sampleError))).to.equal(` ${defaultBang}   Errorz: This is a CLI error`)
    })
  })
})
