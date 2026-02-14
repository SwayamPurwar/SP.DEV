import { sfx } from './audio-system.js';

export let isMatrixActive = false;
let matrixInterval;

export function toggleMatrix(enable) {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (enable) {
        if (isMatrixActive) return;
        isMatrixActive = true;
        gsap.to(canvas, { opacity: 1, duration: 1 });
        matrixInterval = setInterval(() => drawMatrix(ctx, canvas), 33);
        document.documentElement.style.setProperty('--accent', '#0F0');
    } else {
        isMatrixActive = false;
        gsap.to(canvas, { opacity: 0, duration: 1, onComplete: () => {
            clearInterval(matrixInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }});
        document.documentElement.style.setProperty('--accent', '#bfa5d8');
    }
}

function drawMatrix(ctx, canvas) {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    if (!canvas.drops) canvas.drops = new Array(Math.floor(canvas.width / fontSize)).fill(1);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "#0F0"; 
    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < canvas.drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, canvas.drops[i] * fontSize);
        if (canvas.drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            canvas.drops[i] = 0;
        }
        canvas.drops[i]++;
    }
}

export function toggleBlackout() {
    const blackoutDiv = document.getElementById("blackout-overlay");
    const breaker = document.getElementById("breaker-switch");
    if (!blackoutDiv || !breaker) return;

    if (!blackoutDiv.classList.contains("active")) {
        sfx.playClick(); 
        blackoutDiv.classList.add("active");
        breaker.style.left = (Math.random() * (window.innerWidth - 100)) + "px";
        breaker.style.top = (Math.random() * (window.innerHeight - 150)) + "px";
        breaker.style.display = "block";
    } else {
        sfx.playBoot(); 
        blackoutDiv.classList.remove("active");
        breaker.style.display = "none";
    }
}

let gravityInterval;
export function initGravity() {
    if (gravityInterval) return; 
    const elements = document.querySelectorAll('p, h1, h2, h3, span, img, .btn, .nav-item, .project-card');
    const gravityElements = [];
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.position = 'fixed'; el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px'; 
        el.style.width = rect.width + 'px'; el.style.margin = '0'; el.style.transition = 'none'; 
        gravityElements.push({ element: el, vx: (Math.random() - 0.5) * 4, vy: 0, bounciness: Math.random() * 0.5 + 0.3 });
    });
    gravityInterval = setInterval(() => {
        gravityElements.forEach(obj => {
            obj.vy += 0.5; 
            let top = parseFloat(obj.element.style.top); let left = parseFloat(obj.element.style.left);
            top += obj.vy; left += obj.vx;
            if (top + obj.element.offsetHeight > window.innerHeight) { 
                top = window.innerHeight - obj.element.offsetHeight; obj.vy *= -obj.bounciness; obj.vx *= 0.95; 
                if (Math.abs(obj.vy) < 1) obj.vy = 0; 
            }
            if (left < 0 || left + obj.element.offsetWidth > window.innerWidth) { 
                obj.vx *= -1; left = left < 0 ? 0 : window.innerWidth - obj.element.offsetWidth; 
            }
            obj.element.style.top = top + 'px'; obj.element.style.left = left + 'px'; 
            obj.element.style.transform = `rotate(${obj.vx * 2}deg)`;
        });
    }, 16); 
}

export function initEasterEggs() {
    // Canvas setup
    const canvas = document.getElementById("matrix-canvas");
    if (canvas) {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    }

    // Blackout DOM setup
    const blackoutDiv = document.createElement("div"); blackoutDiv.id = "blackout-overlay";
    const breaker = document.createElement("div"); breaker.id = "breaker-switch";
    breaker.innerHTML = '<div class="lever"></div>';
    document.body.append(blackoutDiv, breaker);
    document.addEventListener("mousemove", (e) => {
        if (blackoutDiv.classList.contains("active")) {
            blackoutDiv.style.setProperty("--x", e.clientX + "px");
            blackoutDiv.style.setProperty("--y", e.clientY + "px");
        }
    });
    breaker.addEventListener("click", toggleBlackout);

    // Boss Mode setup
    const bossScreen = document.createElement("div"); bossScreen.id = "boss-screen";
    bossScreen.innerHTML = `<div class="fake-code"><span style="color: #c586c0">import</span> React <span style="color: #c586c0">from</span> <span style="color: #ce9178">'react'</span>;<br><br><span style="color: #569cd6">const</span> <span style="color: #dcdcaa">App</span> = () => {<br>&nbsp;&nbsp;<span style="color: #4ec9b0">console</span>.<span style="color: #dcdcaa">log</span>(<span style="color: #ce9178">"Project Deadline: ASAP"</span>);<br>&nbsp;&nbsp;<span style="color: #c586c0">return</span> (<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style="color: #569cd6">div</span> className=<span style="color: #ce9178">"container"</span>&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style="color: #569cd6">h1</span>&gt;Compiling Production Build...&lt;/<span style="color: #569cd6">h1</span>&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span style="color: #569cd6">div</span>&gt;<br>&nbsp;&nbsp;);<br>}<br><br><span style="color: #6a9955">// Press ESC twice to return to portfolio</span></div>`;
    document.body.appendChild(bossScreen);

    let inputSequence = "", escCount = 0, escTimer;
    window.addEventListener("keydown", (e) => {
        // Matrix Keyboard Hook
        inputSequence += e.key.toLowerCase();
        if (inputSequence.length > 6) inputSequence = inputSequence.slice(-6);
        if (inputSequence === "matrix") toggleMatrix(!isMatrixActive);

        // Boss Mode Keyboard Hook
        if (e.key === "Escape") {
            escCount++; clearTimeout(escTimer); escTimer = setTimeout(() => escCount = 0, 500);
            if (escCount === 2) {
                bossScreen.style.display = bossScreen.style.display === "flex" ? "none" : "flex";
                document.title = bossScreen.style.display === "flex" ? "index.js - Visual Studio Code" : "Swayam | Creative Developer";
                escCount = 0;
            }
        }
    });
}