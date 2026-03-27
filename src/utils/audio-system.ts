import { interactiveSelector } from "./constants";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    audioSystemBound?: boolean;
  }
}

class SystemSound {
  ctx: AudioContext;
  masterGain: GainNode;
  isMuted: boolean;

  constructor() {
    // Only initialize if we are in the browser
    const AudioContextClass = typeof window !== "undefined" 
      ? window.AudioContext || window.webkitAudioContext 
      : null;
      
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.05;
      this.masterGain.connect(this.ctx.destination);
    } else {
      this.ctx = {} as AudioContext; // SSR fallback
      this.masterGain = {} as GainNode;
    }
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
    if (!this.isMuted) {
      this.ensureAudio();
      this.playHover();
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("audioMuteToggled", { detail: this.isMuted }));
    }
    return this.isMuted;
  }

  playBoot() {
    if (this.isMuted || !this.ctx || this.ctx.state !== "running") return;
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
    if (this.isMuted || !this.ctx || this.ctx.state !== "running") return;
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
    if (this.isMuted || !this.ctx || this.ctx.state !== "running") return;
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
  if (typeof window === "undefined" || window.audioSystemBound) return;

  const unlockEvents = ["mousedown", "pointerdown", "touchstart", "keydown", "click"];
  const unlockAudio = () => {
    if (sfx.ctx.state === "suspended") {
      sfx.ctx.resume().then(() => {
        if (sfx.ctx.state === "running") {
          unlockEvents.forEach((e) => window.removeEventListener(e, unlockAudio));
        }
      }).catch(() => {});
    }
  };

  unlockEvents.forEach((e) => window.addEventListener(e, unlockAudio));

  document.addEventListener("mouseover", (e) => {
    if ((e.target as HTMLElement).closest(interactiveSelector)) sfx.playHover();
  });

  document.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).closest(interactiveSelector)) sfx.playClick();
  });

  window.audioSystemBound = true;
}