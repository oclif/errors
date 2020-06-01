import {expect, fancy} from 'fancy-test'
import {error} from '../src'
import {PrettyPrintableError} from '../src/errors/pretty-print'

describe('error', () => {
  fancy
  .do(() => {
    error('An error happened!')
  })
  .catch((error: PrettyPrintableError) => {
    expect(error.message).to.equal('An error happened!')
  })
  .it('throws an error using a string argument')

  fancy
  .do(() => {
    error('An error happened!', {code: 'ERR', ref: 'https://oclif.com/error', suggestion: 'rm -rf node_modules'})
  })
  .catch((error: PrettyPrintableError) => {
    expect(error.message).to.equal('An error happened!')
    expect(error.code).to.equal('ERR')
    expect(error.ref).to.equal('https://oclif.com/error')
    expect(error.suggestion).to.equal('rm -rf node_modules')
  })
  .it('attaches pretty print properties to a new error from options')

  fancy
  .do(() => {
    error(new Error('An existing error object error!'), {code: 'ERR', ref: 'https://oclif.com/error', suggestion: 'rm -rf node_modules'})
  })
  .catch((error: PrettyPrintableError) => {
    expect(error.message).to.equal('An existing error object error!')
    expect(error.code).to.equal('ERR')
    expect(error.ref).to.equal('https://oclif.com/error')
    expect(error.suggestion).to.equal('rm -rf node_modules')
  })
  .it('attached pretty print properties from options to an existing error object')
})
