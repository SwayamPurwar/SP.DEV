import { sfx } from './audio-system.js';
import { toggleMatrix, toggleBlackout, initGravity } from './easter-eggs.js';

export function initTerminal() {
    const terminal = document.getElementById("cmd-terminal");
    const cmdInput = document.getElementById("cmd-input");
    const cmdOutput = document.getElementById("cmd-output");
    let isTerminalOpen = false;
    let isAiMode = false;

    if(!terminal || !cmdInput || !cmdOutput) return;

    window.addEventListener("keydown", (e) => {
        if (e.key === "`" || e.key === "~") { e.preventDefault(); toggleTerminal(); }
    });

    function toggleTerminal() {
        isTerminalOpen = !isTerminalOpen;
        if (isTerminalOpen) {
            terminal.classList.add("active");
            cmdInput.value = "";
            cmdInput.focus();
            sfx.playClick(); 
        } else {
            terminal.classList.remove("active");
            cmdInput.blur();
        }
    }

    function printOutput(text, isHTML = false) {
        const line = document.createElement("div");
        if(isHTML) line.innerHTML = text; else line.textContent = text;
        cmdOutput.appendChild(line);
    }

    cmdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = cmdInput.value.trim();
            if (!input) return;
            if (isAiMode) {
                printOutput(`<span style="color: #fff">You:</span> ${input}`, true);
                processAiQuery(input);
            } else {
                printOutput(`user@swayam:~$ ${input}`);
                executeCommand(input.toLowerCase());
            }
            cmdInput.value = "";
            cmdInput.focus();
            setTimeout(() => { cmdOutput.scrollTop = cmdOutput.scrollHeight; }, 50);
        }
    });

    function executeCommand(cmd) {
        const parts = cmd.split(" ");
        const action = parts[0];
        const arg = parts[1];
        
        switch (action) {
            case "help":
                printOutput(`AVAILABLE COMMANDS:\nhelp, clear, goto [page], color [hex], matrix, socials, whoami, blackout, gravity, theme [name]`);
                break;
            case "clear": cmdOutput.innerHTML = ""; break;
            case "goto":
                if (arg === "home") window.location.href = "index.html";
                else if (arg === "about") window.location.href = "about.html";
                else if (arg === "work") window.location.href = "#work";
                else printOutput("Error: Page not found.");
                break;
            case "socials": printOutput("GitHub | LinkedIn"); window.open("https://github.com/SwayamPurwar", "_blank"); break;
            case "whoami": printOutput("Guest User [IP: UNKNOWN]. Access Level: Visitor."); break;
            case "matrix": printOutput("Initializing Matrix..."); toggleMatrix(true); break;
            case "color":
                if (arg) {
                    document.documentElement.style.setProperty('--accent', arg);
                    const glow = document.getElementById("ambient-glow");
                    if(glow) glow.style.background = `radial-gradient(circle, ${arg}40 0%, rgba(0, 0, 0, 0) 70%)`;
                    printOutput(`SUCCESS: System accent changed to ${arg}`);
                    sfx.playBoot();
                } else printOutput("Error: Please specify a color.");
                break;
            case "blackout":
            case "shutdown":
                printOutput("INITIATING SYSTEM POWER CUT...", true);
                setTimeout(toggleBlackout, 800);
                break;
            case "gravity":
                printOutput("WARNING: ARTIFICIAL GRAVITY GENERATORS FAILING...", true);
                setTimeout(() => { printOutput("CRITICAL ERROR: STRUCTURE UNSTABLE."); initGravity(); }, 1000);
                break;
            case "theme":
                if (arg === "blueprint") { document.body.className = "theme-blueprint"; printOutput("System reloaded: BLUEPRINT."); } 
                else if (arg === "paper") { document.body.className = "theme-paper"; printOutput("System reloaded: ANALOG."); } 
                else if (arg === "reset" || arg === "default") { document.body.className = ""; printOutput("System restored."); } 
                else printOutput("Themes available: blueprint, paper, reset");
                break;
            case "ai":
            case "chat":
                isAiMode = true;
                printOutput("S.A.M. v1.0 ONLINE. Talk to me.");
                break;
            default: printOutput(`Command not found: '${cmd}'. Type 'help'.`);
        }
    }

    function processAiQuery(input) {
        const text = input.toLowerCase();
        let response = ""; let action = null;

        if (text.includes("hello") || text.includes("hi")) response = "Greetings. I am S.A.M., the system guardian.";
        else if (text.includes("who is swayam")) response = "Swayam is a Creative Developer based in India.";
        else if (text.includes("destroy") || text.includes("fall")) { response = "Initiating collapse..."; action = initGravity; }
        else if (text.includes("dark") || text.includes("blackout")) { response = "Toggling lighting..."; action = toggleBlackout; }
        else if (text.includes("matrix")) { response = "Injecting code..."; action = () => toggleMatrix(true); }
        else if (text === "exit") { response = "Terminating session."; isAiMode = false; }
        else response = "Processing... I do not understand that query. Try 'destroy site'.";

        const loadingId = "ai-loading-" + Date.now();
        printOutput(`<span id="${loadingId}" style="color: #0f0">S.A.M. ></span> Thinking...`, true);

        setTimeout(() => {
            document.getElementById(loadingId)?.parentElement.remove();
            const line = document.createElement("div");
            line.innerHTML = `<span style="color: #0f0">S.A.M. ></span> `;
            cmdOutput.appendChild(line);
            
            let i = 0;
            const typeInterval = setInterval(() => {
                line.innerHTML += response.charAt(i);
                cmdOutput.scrollTop = cmdOutput.scrollHeight;
                i++;
                if (i >= response.length) {
                    clearInterval(typeInterval);
                    if (action) setTimeout(action, 500);
                }
            }, 30); 
        }, 600);
    }

    // Mobile God Mode trigger
    const logoTrigger = document.querySelector('.logo');
    let tapCount = 0, tapTimer;
    if (logoTrigger) {
        logoTrigger.addEventListener('click', (e) => {
            tapCount++; clearTimeout(tapTimer); tapTimer = setTimeout(() => tapCount = 0, 500);
            if (tapCount === 3) { e.preventDefault(); toggleTerminal(); tapCount = 0; if (navigator.vibrate) navigator.vibrate([50, 50, 50]); }
        });
    }
    document.getElementById("cmd-close-mobile")?.addEventListener("click", toggleTerminal);
}