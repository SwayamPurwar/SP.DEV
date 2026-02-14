import { interactiveSelector } from './constants.js';

class SystemSound {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.05; 
        this.masterGain.connect(this.ctx.destination);
    }

    ensureAudio() {
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
    const unlockEvents = ['mousedown', 'touchstart', 'keydown', 'click', 'mousemove', 'scroll'];

    const unlockAudio = () => {
        if (sfx.ctx.state === 'suspended') {
            sfx.ctx.resume().then(() => {
                if (sfx.ctx.state === 'running') {
                    unlockEvents.forEach(e => window.removeEventListener(e, unlockAudio));
                }
            }).catch(() => {});
        }
    };

    unlockEvents.forEach(e => window.addEventListener(e, unlockAudio));

    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveSelector)) sfx.playHover();
    });

    document.addEventListener("mousedown", (e) => {
        if (e.target.closest(interactiveSelector)) sfx.playClick();
    });
}