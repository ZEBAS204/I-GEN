import Logger from './logger'
import { getData } from './appStorage'

/**
 * Check if TTS is supported in current browser
 * @return {Boolean}
 */
const isSupported = window.speechSynthesis !== null ? true : false

const synth = window.speechSynthesis

/**
 * @param {String} text Text to speak
 * @param {Boolean} awaitEnds Will enable the ability to use callbacks in say() function
 * * Static params:
 * @param {Array} voice OS supported voice
 * @param {Number} vol Voice volume
 * @param {Number} rate Speak velocity
 * @param {Number} pitch Pitch intensify
 * @param {String} lang OS supported language
 * @class
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
 */
export default class TTS {
	static _lang = synth.lang || 'en-US' // Chrome on Android Requires this
	static _voices = []
	static _voice = TTS._voices[0]
	static _volume = 1
	static _rate = 1
	static _pitch = 1
	static _allowSpam = false // Who would want to spam the TTS...?

	constructor(text, awaitEnds) {
		this.text = text || 'Hello, world!'
		this.awaitEnds = awaitEnds || false
	}

	/**
	 * Helper function to stop TTS if speaking
	 * @return {void}
	 * @static
	 */
	static stop() {
		if (isSupported) {
			if (synth.speaking) {
				synth.cancel()
				// If we don't set this, will give a memory leak warning
				// when prematurely get stopped
				this.awaitEnds = null
			}
		}
	}

	/**
	 *
	 * @return {Array} Device supported voices
	 * @static
	 */
	static getVoices() {
		let voices = []

		// Check if there are already voices saved inside the static voice variable
		// If they exist, just return these
		// If not exist, loop all voices and save inside the static voice variable as cache
		if (TTS._voices.length) {
			voices = TTS._voices
		} else {
			if (isSupported) {
				synth.getVoices().forEach((voice, i) => {
					i++
					TTS._voices.push(voice)
				})

				// Set default voice
				// FIXME: use voice defined by user
				TTS._voice = TTS._voices[0]
			}
		}

		return voices
	}

	/**
	 * Helper function to change TTS voice
	 * @param {Number} voiceIndex Index of the voice in voices() Array
	 * @return {void}
	 */
	static changeVoice(voiceIndex) {
		if (
			voiceIndex &&
			(typeof voiceIndex === 'number' || typeof voiceIndex === 'string')
		) {
			TTS._voice = TTS._voices[voiceIndex]
		} else {
			Logger.log(
				['TTS', 'error'],
				'ChangeVoice(): voice needs to be a specified number to work'
			)
		}
	}

	/**
	 * Speak the given text with device TTS if supported
	 * @param {Function} callback When stop speaking. Callback if `this.awaitEnds` is true
	 * @async
	 * @return {Object} The object itself
	 */
	async say(callback) {
		if (!isSupported) {
			return this
		}

		if (synth.speaking && !TTS._allowSpam) {
			// Without this, will queue all messages and speak them
			// as fast as the one speaking ends. Bad if user spams
			console.error(
				"Already speaking\nDon't try spamming the button. I thought about that first"
			)
			return this
		}

		const tts = new SpeechSynthesisUtterance(this.text)
		tts.voice = TTS._voice
		tts.volume = TTS._volume
		tts.lang = TTS._lang
		tts.rate = TTS._rate
		tts.pitch = TTS._pitch
		synth.speak(tts)

		// Create a new event to fire after speech ending
		if (this.awaitEnds) {
			tts.addEventListener(
				'end',
				() => {
					if (callback && typeof callback === 'function') callback()
				},
				{ once: true } // Remove eventlistener after firing
			)
		}

		return this
	}
}
//? Chromium base browser (voices not loaded at startup)
// We will use an eventlistener to known when the voices are loaded
// so we can get all voices without any problem
;(async () => {
	if (isSupported) {
		// Firefox doesn't care about the listener but its loaded at startup
		// so only needs to be fired.
		TTS.getVoices()

		// Load user saved TTS config if exist
		await getData('tts_speed').then((speed) => {
			if (speed !== null && typeof speed === 'number') {
				TTS._rate = speed
			}
		})
		await getData('tts_volume').then((vol) => {
			if (vol !== null && typeof vol === 'number') {
				TTS._volume = vol
			}
		})

		// If the event listener is supported, and it's base chromium
		// set the event so the browser don't get anxiety
		if (speechSynthesis.onvoiceschanged !== undefined) {
			const timeStart = performance.now() //* Edge(~189.1ms) Chrome(~165.8ms)
			synth.addEventListener(
				'voiceschanged',
				() => {
					Logger.log(['TTS'], 'Voices loaded!', performance.now() - timeStart)
					TTS.getVoices()
				},
				{ once: true } // Remove eventlistener after firing
			)
		}
	} else {
		console.error('Looks like Text To Speak is not supported by your device')
	}
})()

//! Make it accessible from console
window.TTS = TTS
