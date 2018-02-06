// tslint:disable

declare namespace NodeJS {
  interface Global {
    anycli?: {
      debug?: boolean
      errlog?: string
    }
  }
}
