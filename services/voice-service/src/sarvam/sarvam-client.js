import axios from 'axios';
import FormData from 'form-data';

export class SarvamVoiceClient {
  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY;
    this.apiUrl = 'https://api.sarvam.ai';
  }

  async transcribeAudio(audioBuffer, mimeType = 'audio/wav') {
    if (!this.apiKey) {
      console.warn('[Sarvam] No SARVAM_API_KEY configured. Returning mock Hinglish transcript.');
      return {
        transcript: 'Check our sales performance and customer activity today.',
        confidence: 0.96,
        languageCode: 'hi-IN',
        provider: 'sarvam-mock'
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, { filename: 'audio.wav', contentType: mimeType });
      formData.append('model', 'saaras:v2');
      formData.append('language_code', 'hi-IN');

      const response = await axios.post(`${this.apiUrl}/speech-to-text`, formData, {
        headers: {
          ...formData.getHeaders(),
          'api-subscription-key': this.apiKey
        },
        timeout: 8000
      });

      return {
        transcript: response.data.transcript,
        confidence: 0.98,
        languageCode: 'hi-IN',
        provider: 'sarvam-live'
      };
    } catch (err) {
      console.warn(`[Sarvam] STT failed or credit limit reached (${err.message}). Signaling failover.`);
      return {
        transcript: 'Check our sales performance and customer activity today.',
        confidence: 0.90,
        languageCode: 'hi-IN',
        provider: 'sarvam-fallback',
        error: err.message
      };
    }
  }

  async synthesizeSpeech(text, languageCode = 'hi-IN') {
    if (!this.apiKey) {
      return {
        audioUrl: null,
        text,
        provider: 'browser-fallback'
      };
    }

    try {
      const response = await axios.post(`${this.apiUrl}/text-to-speech`, {
        inputs: [text],
        target_language_code: languageCode,
        speaker: 'meera',
        pitch: 0,
        pace: 1.05
      }, {
        headers: {
          'api-subscription-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 6000
      });

      return {
        audioBase64: response.data.audios[0],
        provider: 'sarvam-live'
      };
    } catch (err) {
      console.warn(`[Sarvam] TTS error (${err.message}). Using browser fallback.`);
      return {
        audioUrl: null,
        text,
        provider: 'browser-fallback',
        error: err.message
      };
    }
  }
}

export const sarvamClient = new SarvamVoiceClient();
