import fs from 'fs'

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Define the time format
function getTime(): string {
  const now = new Date()
  return now.toLocaleString('he')
}

function isError(e: unknown): e is Error {
  return e instanceof Error
}

function doLog(level: string, ...args: unknown[]) {
  const strs = args.map(arg =>
    typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)
  )

  let line = strs.join(' | ')
  line = `${getTime()} - ${level} - ${line}\n`
  console.log(line)
  fs.appendFile('logs/backend.log', line, err => {
    if (err) console.log('FATAL: cannot write to log file', err)
  })
}

export const logger = {
  debug(...args: unknown[]) {
    if (process.env.NODE_ENV === 'production') return // Fixed typo NODE_NEV -> NODE_ENV
    doLog('DEBUG', ...args)
  },
  info(...args: unknown[]) {
    doLog('INFO', ...args)
  },
  warn(...args: unknown[]) {
    doLog('WARN', ...args)
  },
  error(...args: unknown[]) {
    doLog('ERROR', ...args)
  },
}
