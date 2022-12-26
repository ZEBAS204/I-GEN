import Logger from './logger'
import { getData } from './appStorage'

const log = Logger.getLogger('TTS')
const synth = window.speechSynthesis
const isSupported = typeof synth === 'object' ? true : false

/**
 * Web Speech API helper wrapper
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
 * @example
 * const tts = new TTS('This is a Text to speak example')
 * // Change current to random voice available on the device
 * tts.changeVoice(Math.floor(Math.random() * tts.getVoices().length))
 * tts.say() // speak
 *
 * // To prematurely stop the speech
 * tts.stop()
 */
export default class TTS {
	/**
	 * Synthesis voice language to use (defaults to en-US)
	 * @type {string}
	 */
	static _lang = 'en-US' // Chrome on Android requires an initial language

	/**
	 * Synthesis voice available in the device
	 * @type {[]|SpeechSynthesisVoice[]}
	 */
	static _voices = []

	/**
	 * Current synthesis voice using
	 * @type {SpeechSynthesisVoice}
	 */
	static _voice = null

	/**
	 * Synthesis voice volume
	 * @type {number}
	 */
	static _volume = 1

	/**
	 * Synthesis voice velocity
	 * @type {number}
	 */
	static _rate = 1

	/**
	 * Synthesis voice pitch intensify
	 * @type {number}
	 */
	static _pitch = 1

	/**
	 * Allow SpeechSynthesis to queue messages
	 * @type {boolean}
	 */
	static _allowSpam = false

	/**
	 * @param {string} text Text to speak
	 * @param {boolean} awaitEnds If true, the callback in `say` function will be called
	 */
	constructor(
		text = 'This is what text to speech sounds like.',
		awaitEnds = false
	) {
		this.text = text
		this.awaitEnds = awaitEnds
	}

	/**
	 * Stop TTS
	 * @return {void}
	 * @static
	 */
	static stop() {
		if (!isSupported || !synth.speaking) return

		synth.cancel()
		// If we don't set this, will give a "memory leak"
		// ignorable warning when prematurely get stopped
		this.awaitEnds = null
	}

	/**
	 * Retrieve an array of the synthesis voices available on the device
	 * @return {[]|SpeechSynthesisVoice[]} Device supported voices
	 * @static
	 */
	static getVoices() {
		if (!isSupported) return []

		/*
		 * Check if there are already voices saved inside the static voice variable
		 * If they exist, just return the saved ones
		 * If any exist, loop all voices and save inside the static voice variable as cache
		 */
		if (TTS._voices.length) return TTS._voices

		const voices = synth.getVoices()
		for (let i = 0; i < voices.length; i++) {
			const voice = voices[i]

			if (!voice.default) {
				TTS._voices.push(voice)
				continue
			}

			// Enforce first element of voices array to be the default voice
			log.info(['TTS'], `Voice[${i}] is device default voice`)
			voices.unshift(voice[i])
			voices.splice(i + 1, 1)
			TTS._voice = TTS._voices[0]
		}

		return voices
	}

	/**
	 * Change TTS voice
	 * @param {number} newVoice Index number of the voice in `TTS._voices` array
	 * @return {void}
	 */
	static changeVoice(newVoice) {
		if (!isSupported) return
		if (typeof newVoice !== 'number')
			throw new TypeError('newVoice is not a number')

		if (newVoice <= TTS._voices.length && newVoice >= 0) {
			log.info(['TTS'], 'Changed voice', TTS._voices[newVoice])
			TTS._voice = TTS._voices[newVoice]
		}
	}

	/**
	 * Speak the given text with device TTS if supported
	 * @param {function} [callback] After stop speaking executes callback if `this.awaitEnds` is true
	 * @return {object} The object itself
	 * @async
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

			if (synth.getVoices().length) {
				resolve()
				clearInterval(int)
			}
		}, 50)
	})
		.then(() => {
			log.info(['TTS'], 'Voices loaded!')
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
		.catch((err) => log.warn(['TTS'], err))
})()

//! Make it accessible from console in dev
if (import.meta.env.DEV) window.TTS = TTS
