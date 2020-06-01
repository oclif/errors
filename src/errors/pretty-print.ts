import * as wrap from 'wrap-ansi'
import indent = require('indent-string')
import * as screen from '../screen'

export interface PrettyPrintableError {
  /**
   * messsage to display related to the error
   */
  message?: string;

  /**
   * a unique error code for this instance of the error
   */
  code?: string;

  /**
   * a url to find out more information related to this error
   * or fixing the error
   */
  ref?: string;

  /**
   * a suggestion that may be useful or provide additional context
   */
  suggestion?: string;
}

// These exist for backwards compatibility with CLIError
type CLIErrorDisplayOptions = { name?: string; bang?: string }

export default function prettyPrint(error: PrettyPrintableError & CLIErrorDisplayOptions) {
  const {message, code, suggestion, ref, name: errorSuffix, bang} = error

  // errorSuffix is pulled from the 'name' property on CLIError
  // and is like either Error or Warning
  const formattedHeader = message ? `${errorSuffix || 'Error'}: ${message}` : undefined
  const formattedCode = code ? `Code: ${code}` : undefined
  const formattedSuggestion = suggestion ? `Suggestion: ${suggestion}` : undefined
  const formattedReference = ref ? `Reference: ${ref}` : undefined

  const formatted = [formattedHeader, formattedCode, formattedSuggestion, formattedReference]
  .filter(Boolean)
  .join('\n')

  let output = wrap(formatted, screen.errtermwidth - 6, {trim: false, hard: true} as any)
  output = indent(output, 3)
  output = indent(output, 1, {indent: bang || '', includeEmptyLines: true} as any)
  output = indent(output, 1)

  return output
}
