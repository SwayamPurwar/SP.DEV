// Geminin/src/utils/audio-system.js
import { interactiveSelector } from "./constants.js";

class SystemSound {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.05;
    this.masterGain.connect(this.ctx.destination);
    // Default to muted
    this.isMuted = true;
  }

  async ensureAudio() {
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed:", e);
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // Unmuting counts as an interaction to resume context
    if (!this.isMuted) {
      this.ensureAudio();
      this.playHover(); // Small feedback sound
    }
    return this.isMuted;
  }

  playBoot() {
    if (this.isMuted) return; // Skip if muted
    this.ensureAudio();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  playHover() {
    if (this.isMuted || this.ctx.state !== "running") return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playClick() {
    if (this.isMuted || this.ctx.state !== "running") return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

export const sfx = new SystemSound();

export function initAudio() {
  if (window.audioSystemBound) return;

  const unlockEvents = [
    "mousedown",
    "pointerdown",
    "touchstart",
    "keydown",
    "click",
  ];
  const unlockAudio = () => {
    if (sfx.ctx.state === "suspended") {
      sfx.ctx
        .resume()
        .then(() => {
          if (sfx.ctx.state === "running") {
            unlockEvents.forEach((e) =>
              window.removeEventListener(e, unlockAudio),
            );
          }
        })
        .catch(() => {});
    }
  };

  unlockEvents.forEach((e) => window.addEventListener(e, unlockAudio));

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelector)) sfx.playHover();
  });

  document.addEventListener("mousedown", (e) => {
    if (e.target.closest(interactiveSelector)) sfx.playClick();
  });

  window.audioSystemBound = true;
}
