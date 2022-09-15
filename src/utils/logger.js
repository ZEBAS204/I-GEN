import log from 'loglevel'
/** @type {import('loglevel').Logger} */

/**
 * The variable name is keep to make old logger transition easier
 * @see https://github.com/pimterry/loglevel
 */
const Logger = /** @type {Logger} */ log

if (import.meta.env.DEV) log.enableAll()

Logger.log(
	`%cI-GEN ${window.__GIT_BRANCH__} (${window.__GIT_REVISION__})`,
	'color: #00FF00; background: black; font-size: 2em; padding: 10px; border: 2px solid #00FF00;'
)

export default Logger

//! Make it accessible from console
window.Logger = Logger
