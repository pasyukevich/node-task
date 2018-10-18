import { createLogger, transports } from 'winston'

const options = {
  file: {
    colorize: false,
    filename: `app.log`,
    handleExceptions: true,
    json: true,
    level: 'info',
    maxFiles: 5,
    maxsize: 5242880
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

const logger = createLogger({
  transports: [new transports.File(options.file), new transports.Console(options.console)],
  exitOnError: false
})

class MyStream {
  public write(text: string) {
    logger.info(text)
  }
}

const myStream = new MyStream()

export default myStream
