import { getData } from './appStorage'

export default class Logger {
	//* Only saves if is enabled, so we don't use getData in every call
	static _enabled

	/**
	 ** If is the first call, will get the saved setting if exist
	 ** Note, in dev environment will always be enabled (can be disabled in settings)
	 * @param {boolean} forced Force refresh of user setting
	 * @return {boolean} If it's enabled
	 * @static
	 */
	static async isLoggerEnabled(forced = false) {
		if (process.env.NODE_ENV === 'development' || !forced) {
			// Will always be logging in development environment
			Logger._enabled = true
		}

		if (Logger._enabled === undefined || forced) {
			await getData('dev_mode').then((enabled) => {
				Logger._enabled = enabled !== null ? enabled : false
			})
		}

		// Let know if the Logger is enabled
		Logger._enabled
			? console.info('[Logger] Logging is enabled!')
			: console.info('[Logger] Logging is disabled!')

		return Logger._enabled
	}

	/**
	 * The current function to log
	 * @param {'info' | 'warn' | 'error'} type Type of function to call
	 * @param {string} name What will show inside brackets at the start of log [..]
	 * @param  {...any} args Everything you want to log
	 * @static
	 */
	static log([name, type], ...args) {
		const _type = type ? type.toLowerCase() : 'log'
		const _name = name || '*'
		const _args = args || undefined

		// Check if logging is enabled
		if (
			Logger._enabled !== undefined ? Logger._enabled : Logger.isLoggerEnabled()
		) {
			// Check if there is any passed arguments to log
			// If the aren't exit the call with a warning
			if (!_args) {
				console.warn(
					'[Logger] No argument given. You should pass at least one argument.'
				)

				return
			}

			// This will be replaced with the type of console
			const log = `[${_name}] ${_args}`

			switch (_type) {
				case 'info':
					console.info(log)
					break

				case 'warn':
					console.warn(log)
					break

				case 'error':
					console.error(log)
					break

				default:
					// if is set type as log, it will end up here anyways ¯\_(ツ)_/¯
					console.log(log)
					break
			}
		} else {
			console.log('[Logger] Logger is not enabled')
		}
	}
}

//! Make it accessible from console
window.Logger = Logger
