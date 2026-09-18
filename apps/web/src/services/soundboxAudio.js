// Web Audio API Synthesizer for Paytm Soundbox 3.0 Chime
export function playPaytmChime(spokenText = null) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    // First Tone: 784 Hz (G5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(784, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Second Tone: 1046 Hz (C6)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046, now + 0.15);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);

    // If spoken text is provided, use SpeechSynthesis
    if (spokenText && 'speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        // Try Hindi voice if available
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
        if (hindiVoice) utterance.voice = hindiVoice;
        window.speechSynthesis.speak(utterance);
      }, 500);
    }
  } catch (err) {
    console.warn('[Soundbox] Web Audio error:', err);
  }
}
