/*
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
 */
const synth = window.speechSynthesis /* || chrome.tts*/
const voices = synth.getVoices()

export default class TTS {
	constructor(text, voice, vol, rate, pitch, lang) {
		this.text = text || 'Hello, world.'
		this.lang = lang || 'en-US'
		this.voice = voice || voices[0]
		this.volume = vol || 1
		this.rate = rate || 1
		this.pitch = pitch || 1
	}

	async say() {
		if (synth.speaking) {
			// Without this, will queue all messages and speak them
			// as fast as the one speaking stops. Bad if user spams
			console.error(
				"Already speaking\nDon't try spamming the button. I thought about that first"
			)
			return
		}
		const tts = new SpeechSynthesisUtterance(this.text)
		tts.voice = voices[this.voice]
		tts.lang = this.lang
		tts.volume = this.volume
		tts.rate = this.rate
		tts.pitch = this.pitch
		synth.speak(tts)

		return this
	}
}
