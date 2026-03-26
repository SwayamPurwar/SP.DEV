import { initAudio } from './modules/audio-system.js';
import { initAnimations } from './modules/animations.js';
import { initUtils } from './modules/utils.js';
import { initEasterEggs } from './modules/easter-eggs.js';
import { initTerminal } from './modules/terminal.js';

// Register GSAP Plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialize all modules when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initAudio();
    initAnimations();
    initUtils();
    initEasterEggs();
    initTerminal();
});