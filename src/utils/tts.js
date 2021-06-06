//?
/**
 * Check if TTS is supported in current browser
 * @returns {Boolean}
 */
const isSupported = window.speechSynthesis !== null ? true : false

const synth = window.speechSynthesis

/**
 * @param {String} text Text to speak
 * @param {Boolean} awaitEnds Will enable the ability to use callbacks in say() function
 *
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

	constructor(text, awaitEnds) {
		this.text = text || 'Hello, world!'
		this.awaitEnds = awaitEnds || false
	}

	// Helper function to stop TTS if speaking
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

	static getVoices() {
		let voices = []

		// Check if there are already voices saved inside the static voice variable
		// If they exist, just return these
		// If not exist, loop all voices and save inside the static voice variable as cache
		if (TTS._voices.length) {
			voices = TTS._voices
		} else {
			if (isSupported) {
				console.group('Voices')
				synth.getVoices().forEach((voice, index) => {
					index++
					console.log(index, voice)
					TTS._voices.push(voice)
				})
				console.groupEnd()

				// Set the default voice
				// TODO: use voice defined by user
				TTS._voice = TTS._voices[0]
			}
		}

		return voices
	}

	/**
	 * Helper function to change TTS voice
	 * @param {Number} voice Index of the voice in voices() Array
	 */
	static changeVoice(voiceIndex) {
		if (
			voiceIndex &&
			(typeof voiceIndex === 'number' || typeof voiceIndex === 'string')
		) {
			TTS._voice = TTS._voices[voiceIndex]
		} else {
			console.error('changeVoice: voice needs to be a specified number to work')
		}
	}

	// Callback when awaitEnds === true
	async say(callback) {
		if (!isSupported) {
			return this
		}

		if (synth.speaking) {
			// Without this, will queue all messages and speak them
			// as fast as the one speaking ends. Bad if user spams
			console.error(
				"Already speaking\nDon't try spamming the button. I thought about that first"
			)
			return this
		}

		const tts = new SpeechSynthesisUtterance(this.text)
		tts.lang = TTS._lang
		tts.voice = TTS._voice
		tts.volume = TTS._volume
		tts.rate = TTS._rate
		tts.pitch = TTS._pitch
		synth.speak(tts)

		// Create a new event to fire after speech ending
		if (this.awaitEnds) {
			tts.addEventListener(
				'end',
				(event) => {
					if (callback && typeof callback === 'function') callback()
				},
				{ once: true } // Remove event listener after firing
			)
		}

		return this
	}
}

//? Chromium base browser (voices not loaded at startup)
// We will use an eventlistener to known when the voices are loaded
// so we can get all voices without any problem
;(() => {
	if (isSupported) {
		// Firefox doesn't care about the listener but its loaded at startup
		// so only needs to be fired.
		TTS.getVoices()

		// If the event listener is supported, and it's base chromium
		// set the event so the browser don't get anxiety
		if (speechSynthesis.onvoiceschanged !== undefined) {
			const timeStart = performance.now() //* Edge(~189.1ms) Chrome(~165.8ms)
			synth.addEventListener(
				'voiceschanged',
				() => {
					console.log('Voices loaded!', performance.now() - timeStart)
					TTS.getVoices()
				},
				// Remove listener after firing
				{ once: true }
			)
		}
	} else {
		console.error('Looks like Text To Speak is not supported in your device :(')
	}
})()

//! REMOVE THIS
window.TTS = TTS
