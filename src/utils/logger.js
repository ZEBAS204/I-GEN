import log from 'loglevel'

/**
 * The variable name is keep to make old logger transition easier
 * @see https://github.com/pimterry/loglevel
 */
const Logger = log

/**
 ** If in DEV environment enable all logs
 * Default Logger level is 3 (WARN)
 * Will display warning and error messages
 */
if (import.meta.env.DEV) log.setDefaultLevel(0)

export default Logger

//! Make it accessible from console in dev
if (import.meta.env.DEV) window.Logger = Logger
