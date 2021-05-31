//! Global variables
const synth = window.speechSynthesis /* || chrome.tts*/
const voices = synth.getVoices()

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
	static _lang = 'en-US'
	static _voices = voices
	static _voice = voices[0]
	static _volume = 1
	static _rate = 1
	static _pitch = 1

	constructor(text, awaitEnds) {
		this.text = text || 'Hello, world!'
		this.awaitEnds = awaitEnds || false
	}

	// Helper function to stop TTS
	static stop() {
		if (synth.speaking) {
			synth.cancel()
			// If we don't set this, will give a memory leak warning
			// when prematurely get stopped
			this.awaitEnds = null
		}
	}

	// Callback when awaitEnds === true
	async say(callback) {
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

//! REMOVE THIS
window.TTS = TTS
