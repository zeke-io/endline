import chalk from 'chalk'

export const color = {
  info: chalk.blue,
  warn: chalk.yellow,
  success: chalk.green,
  error: chalk.red,
}

const labels = {
  info: color.info.bold('[Info]'),
  warn: color.warn.bold('[Warn]'),
  ready: color.success.bold('[Ready]'),
  error: color.error.bold('[Error]'),
}

export const info = (...data: unknown[]) => console.info(labels.info, ...data)
export const warn = (...data: unknown[]) => console.warn(labels.warn, ...data)
export const ready = (...data: unknown[]) => console.log(labels.ready, ...data)
export const error = (...data: unknown[]) =>
  console.error(labels.error, ...data)
