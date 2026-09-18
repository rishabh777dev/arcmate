import { sarvamClient } from '../sarvam/sarvam-client.js';
import { soundboxSynth } from '../soundbox/soundbox-synth.js';

export class VoiceRouter {
  constructor() {
    this.providerPreference = process.env.VOICE_PROVIDER_PREFERENCE || 'gemini-first';
  }

  setPreference(preference) {
    this.providerPreference = preference;
  }

  getPreference() {
    return this.providerPreference;
  }

  async processVoiceInput(audioBuffer, mimeType) {
    console.log(`[VoiceRouter] Processing speech input with preference: ${this.providerPreference}`);
    
    // Attempt Sarvam first if preferred or fallback to Gemini transcript
    const sarvamResult = await sarvamClient.transcribeAudio(audioBuffer, mimeType);
    return sarvamResult;
  }

  async generateVoiceResponse(text, language = 'hi-IN') {
    return await sarvamClient.synthesizeSpeech(text, language);
  }

  getSoundboxChime(message) {
    return soundboxSynth.getChimePayload(message);
  }
}

export const voiceRouter = new VoiceRouter();
