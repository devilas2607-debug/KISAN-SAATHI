/**
 * Synthesizes high-fidelity audible alert chimes using the Web Audio API.
 * Does not depend on external audio asset downloads or CORS issues.
 */

let audioCtx: AudioContext | null = null;
let activeLoopTimer: any = null;
let isSoundMuted = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChimeTone(freq: number, startTime: number, duration: number, ctx: AudioContext, gainNode: GainNode) {
  const osc = ctx.createOscillator();
  const noteGain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Smooth attack and pleasant bell decay
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.04);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(noteGain);
  noteGain.connect(gainNode);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * Plays a single announcement chime (Ding-Dong / Three-tone alert)
 */
export function playTurnAlertChime() {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;
    // Pleasant high-profile counter chime: D5 (587.33), F#5 (739.99), A5 (880), D6 (1174.66)
    playChimeTone(587.33, now, 0.45, ctx, masterGain);
    playChimeTone(739.99, now + 0.18, 0.45, ctx, masterGain);
    playChimeTone(880.00, now + 0.36, 0.55, ctx, masterGain);
    playChimeTone(1174.66, now + 0.54, 0.95, ctx, masterGain);
  } catch (err) {
    console.warn('Audio chime failed to play:', err);
  }
}

export const playTurnChime = playTurnAlertChime;

/**
 * Starts continuous alarm chime until acknowledged
 */
export function startContinuousTurnAlarm() {
  if (isSoundMuted) return;
  stopContinuousTurnAlarm();
  playTurnAlertChime();
  activeLoopTimer = setInterval(() => {
    playTurnAlertChime();
  }, 3200);
}

/**
 * Stops any looping turn alarm
 */
export function stopContinuousTurnAlarm() {
  if (activeLoopTimer) {
    clearInterval(activeLoopTimer);
    activeLoopTimer = null;
  }
}

export function toggleAudioMute(): boolean {
  isSoundMuted = !isSoundMuted;
  if (isSoundMuted) {
    stopContinuousTurnAlarm();
  }
  return isSoundMuted;
}

export function getAudioMuted(): boolean {
  return isSoundMuted;
}
