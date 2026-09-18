import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Strict Model Selection: gemini-3.1-flash-lite (primary) or gemini-3.5-flash-lite (secondary)
 * Rate limit: High 10-15 RPM for free/dev tier
 */
export const ALLOWED_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];

export class ActionMateGeminiClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    const requestedModel = process.env.GEMINI_REASONING_MODEL || 'gemini-3.1-flash-lite';
    
    // Enforce strict model lock
    this.modelName = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : 'gemini-3.1-flash-lite';
    this.ai = null;
    this.initAI();
  }

  initAI() {
    if (this.apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
        console.log(`[AgentOrchestrator] Gemini client active with model: ${this.modelName}`);
      } catch (err) {
        console.warn(`[AgentOrchestrator] GoogleGenAI init error: ${err.message}`);
        this.ai = null;
      }
    } else {
      console.log('[AgentOrchestrator] No GEMINI_API_KEY provided. Using deterministic reasoning engine.');
      this.ai = null;
    }
  }

  updateConfig({ apiKey, model }) {
    if (apiKey !== undefined) this.apiKey = apiKey || null;
    if (model && ALLOWED_MODELS.includes(model)) this.modelName = model;
    this.initAI();
    return this.getStatus();
  }

  getStatus() {
    return {
      hasKey: !!this.apiKey,
      model: this.modelName,
      provider: 'Google Gemini',
      rateLimitTier: '10-15 RPM High Capacity',
      status: this.apiKey ? 'CONNECTED' : 'STANDBY_FALLBACK'
    };
  }

  async generateResponse(systemInstruction, messages, tools = []) {
    if (!this.ai || !this.apiKey) {
      return null;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: messages,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });
      return response.text;
    } catch (err) {
      console.warn(`[AgentOrchestrator] Gemini API call error (${err.message}). Falling back to deterministic agent brain.`);
      return null;
    }
  }
}

export const geminiClient = new ActionMateGeminiClient();

