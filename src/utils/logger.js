import log from 'loglevel'
/** @type {import('loglevel').Logger} */

/**
 * The variable name is keep to make old logger transition easier
 * @see https://github.com/pimterry/loglevel
 */
const Logger = /** @type {Logger} */ log

if (import.meta.env.DEV) log.enableAll()

export default Logger

//! Make it accessible from console
window.Logger = Logger
