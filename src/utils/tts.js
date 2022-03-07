import Logger from './logger'
import { getData } from './appStorage'

const isSupported = window.speechSynthesis !== null ? true : false
const synth = window.speechSynthesis

/**
 * @param {String} text Text to speak
 * @param {Boolean} awaitEnds Will enable the ability to use callbacks in say() function
 * * Static params:
 * @param {Array} _voice OS supported voice
 * @param {Number} _vol Voice volume
 * @param {Number} _rate Speak velocity
 * @param {Number} _pitch Pitch intensify
 * @param {String} _lang OS supported language
 * @param {Boolean} _allowSpam Allow SpeechSynthesis to queue messages
 * @class
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
 */
export default class TTS {
	static _lang = 'en-US' // Chrome on Android requires an initial language
	static _voices = []
	static _voice = null
	static _volume = 1
	static _rate = 1
	static _pitch = 1
	static _allowSpam = TTS.allowSpam || false // Also know as queue messages

	constructor(
		text = 'This is what text to speech sounds like.',
		awaitEnds = false
	) {
		this.text = text
		this.awaitEnds = awaitEnds
	}

	/**
	 * Helper function to stop TTS if speaking
	 * @return {void}
	 * @static
	 */
	static stop() {
		if (!isSupported) return

		if (synth.speaking) {
			synth.cancel()

			// If we don't set this, will give a "memory leak" ignorable warning
			// when prematurely get stopped
			this.awaitEnds = null
		}
	}

	/**
	 *
	 * @return {Array} Device supported voices
	 * @static
	 */
	static getVoices() {
		if (!isSupported) return []

		let voices = []
		/*
		 * Check if there are already voices saved inside the static voice variable
		 * If they exist, just return the saved ones
		 * If any exist, loop all voices and save inside the static voice variable as cache
		 */
		if (TTS._voices.length) {
			voices = TTS._voices
		} else {
			const voices = synth.getVoices()
			for (let i = 0; i < voices.length; i++) {
				const voice = voices[i]

				if (voice.default) {
					Logger.log(['TTS', 'info'], `Voice[${i}] is device default voice`)
					// Enforce first element of voices array to be the default voice
					voices.unshift(voice[i])
					voices.splice(i + 1, 1)
					TTS._voice = TTS._voices[0]
				} else {
					TTS._voices.push(voice)
				}
			}
		}

		return voices
	}

	/**
	 * Helper function to change TTS voice
	 * @param {Number} newVoice Index number of the voice in TTS._voices array
	 * @return {void}
	 */
	static changeVoice(newVoice) {
		if (!isSupported) return

		if (typeof newVoice === 'number') {
			if (newVoice <= TTS._voices.length && newVoice >= 0) {
				Logger.log(['TTS'], 'Changed voice', TTS._voices[newVoice])
				TTS._voice = TTS._voices[newVoice]
			}
		}
	}

	/**
	 * Speak the given text with device TTS if supported
	 * @param {Function} callback When stop speaking. Callback if `this.awaitEnds` is true
	 * @async
	 * @return {Object} The object itself
	 */
	async say(callback) {
		if (!isSupported) return this

		/**
		 ** If a message is speaking and TTS.allowSpam is disabled new messages will not be queued.
		 ** If TTS.allowSpam is enabled, this rule will be ignored and queue all new messages
		 ** while TTS is speaking to be later spoken.
		 */
		if (synth.speaking && !TTS._allowSpam) return this

		const tts = new SpeechSynthesisUtterance(this.text)
		if (TTS._voice) tts.voice = TTS._voice
		tts.volume = TTS._volume
		tts.lang = tts.lang ?? TTS._lang
		tts.rate = TTS._rate
		tts.pitch = TTS._pitch
		synth.speak(tts)

		// Create a new event to fire after speech ending
		if (this.awaitEnds) {
			tts.addEventListener(
				'end',
				() => {
					if (typeof callback === 'function') callback()
				},
				{ once: true } // Remove eventlistener after firing
			)
		}

		return this
	}
}

/**
 ** Ensure that the voices are properly loaded from the start
 ** After trying to load all voices, restore user saved settings
 */
;(async () => {
	if (!isSupported) {
		console.error('Looks like Text-To-Speech is not supported by your device')
		return
	}

	new Promise((resolve, reject) => {
		let tries = 30

		const int = setInterval(() => {
			if (tries < 1) {
				reject('Voices exceeded max tries')
				clearInterval(int)
			}
			tries--

			// FIXME: DuckDuckGo android error undefined error..?
			if (synth.getVoices().length) {
				resolve()
				clearInterval(int)
			}
		}, 50)
	})
		.catch(() => {
			Logger.log(['TTS', 'warn'], 'Voices exceeded max tries')
		})
		.then(() => {
			Logger.log(['TTS', 'info'], 'Voices loaded!')
			TTS.getVoices() // populate array
		})
		.then(async () => {
			//* Now is safe to load user settings
			await getData('tts_voice').then((voice) => {
				if (typeof voice === 'number') TTS._voice = TTS._voices[voice]
			})
			await getData('tts_speed').then((speed) => {
				if (typeof speed === 'number') TTS._rate = speed
			})
			await getData('tts_volume').then((vol) => {
				if (typeof vol === 'number') TTS._volume = vol
			})
		})
})()

//! Make it accessible from console in dev
if (process.env.NODE_ENV === 'development') window.TTS = TTS
