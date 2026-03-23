import { interactiveSelector } from './constants.js';

class SystemSound {
    constructor() {
        // Initialize AudioContext; it will start in a 'suspended' state by default
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.05; 
        this.masterGain.connect(this.ctx.destination);
    }

    ensureAudio() {
        // Attempting to resume here will only work if triggered by a valid user gesture
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playBoot() {
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
        this.ensureAudio();
        // If state is still suspended, browser is blocking playback
        if (this.ctx.state !== 'running') return;

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
        this.ensureAudio();
        if (this.ctx.state !== 'running') return;

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

    // Events that are recognized by browsers as "User Gestures" to unlock audio
    const unlockEvents = ['mousedown', 'pointerdown', 'touchstart', 'keydown', 'click'];

    const unlockAudio = () => {
        if (sfx.ctx.state === 'suspended') {
            sfx.ctx.resume().then(() => {
                if (sfx.ctx.state === 'running') {
                    // Success! Play boot sound and clean up listeners
                    sfx.playBoot();
                    unlockEvents.forEach(e => window.removeEventListener(e, unlockAudio));
                    console.log("Audio System: Active");
                }
            }).catch(err => console.error("Audio unlock failed:", err));
        }
    };

    // Attach unlock listeners to the window so ANY initial interaction enables sound
    unlockEvents.forEach(e => window.addEventListener(e, unlockAudio, { once: true }));

    // Corrected Mouseover Listener
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveSelector)) {
            if (sfx.ctx.state === 'suspended') {
                // Optional: Provide visual feedback that sound is muted until clicked
                console.warn("Audio suspended. Click anywhere to enable sound.");
            } else {
                sfx.playHover();
            }
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (e.target.closest(interactiveSelector)) {
            sfx.playClick();
        }
    });

    window.audioSystemBound = true;
}