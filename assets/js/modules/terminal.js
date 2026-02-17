import { sfx } from "./audio-system.js";
import { toggleMatrix, toggleBlackout, initGravity } from "./easter-eggs.js";

export function initTerminal() {
  const terminal = document.getElementById("cmd-terminal");
  const cmdInput = document.getElementById("cmd-input");
  const cmdOutput = document.getElementById("cmd-output");
  let isTerminalOpen = false;
  let isAiMode = false;

  // --- NEW: History Variables ---
  let commandHistory = [];
  let historyIndex = -1;
  if (!terminal || !cmdInput || !cmdOutput) return;

  window.addEventListener("keydown", (e) => {


    const loader = document.querySelector(".preloader-container");
  if (loader && loader.style.display !== "none") return; // DO NOTHING
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      toggleTerminal();
    }
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
    if (isHTML) line.innerHTML = text;
    else line.textContent = text;
    cmdOutput.appendChild(line);
  }

  cmdInput.addEventListener("keydown", (e) => {
    // --- NEW: Handle Arrow Keys ---
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        cmdInput.value =
          commandHistory[commandHistory.length - 1 - historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        cmdInput.value =
          commandHistory[commandHistory.length - 1 - historyIndex];
      } else {
        historyIndex = -1;
        cmdInput.value = "";
      }
    } else if (e.key === "Enter") {
      const input = cmdInput.value.trim();
      if (!input) return;

      // Save to history
      commandHistory.push(input);
      historyIndex = -1; // Reset index

      if (isAiMode) {
        printOutput(`<span style="color: #fff">You:</span> ${input}`, true);
        processAiQuery(input);
      } else {
        printOutput(`user@swayam:~$ ${input}`);
        executeCommand(input.toLowerCase());
      }
      cmdInput.value = "";
      cmdInput.focus();
      setTimeout(() => {
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
      }, 50);
    }
  });

  function executeCommand(cmd) {
    const parts = cmd.split(" ");
    const action = parts[0];
    const arg = parts.slice(1).join(" "); // Handles multi-word args if needed

    switch (action) {
      case "help":
        const helpHTML = `
                <div style="color: #666; margin-bottom: 5px; margin-top: 5px;">--- BASIC COMMANDS ---</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">ls</span>       List directory contents (pages)</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">cd</span>       Change directory (navigation)</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">pwd</span>      Print working directory</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">date</span>     Show system date & time</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">history</span>  View command history</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">clear</span>    Clear terminal screen</div>
                
                <div style="color: #666; margin-bottom: 5px; margin-top: 15px;">--- SYSTEM ---</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">whoami</span>   Current user info</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">socials</span>  Connect via LinkedIn/GitHub</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">theme</span>    Change UI theme to Blueprint / Paper</div>
                
                <div style="color: #666; margin-bottom: 5px; margin-top: 15px;">--- EXPERIMENTS ---</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">matrix</span>   Toggle visual effect</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">blackout</span> Power saving mode</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">ai</span> To load Artificial Intelligence</div>
                `;
        printOutput(helpHTML, true);
        break;

      // --- STANDARD UTILS ---
      case "ls":
      case "dir":
        printOutput("index.html   about.html   work/   contact.exe   cv.pdf");
        break;

      case "cd":
        if (arg === ".." || arg === "home" || arg === "index" || arg === "~") {
          window.location.href = "index.html";
          printOutput("Navigating to /home...");
        } else if (arg === "about") {
          window.location.href = "about.html";
          printOutput("Navigating to /about...");
        } else if (arg === "work" || arg === "projects") {
          window.location.href = "#work";
          printOutput("Navigating to /work...");
        } else if (arg === "") {
          printOutput("Usage: cd [page_name]");
        } else {
          printOutput(`bash: cd: ${arg}: No such directory`);
        }
        break;

      case "pwd":
        printOutput("/home/guest/swayam.dev");
        break;

      case "date":
      case "time":
        printOutput(new Date().toString());
        break;

      case "history":
        if (
          typeof commandHistory !== "undefined" &&
          commandHistory.length > 0
        ) {
          printOutput(
            commandHistory.map((c, i) => `${i + 1}  ${c}`).join("\n"),
          );
        } else {
          printOutput("No history found.");
        }
        break;

      case "echo":
        printOutput(arg);
        break;

      case "exit":
      case "gui":
        toggleTerminal(); // Closes the terminal
        break;

      // --- EXISTING CUSTOM COMMANDS ---
      case "clear":
      case "cls":
        cmdOutput.innerHTML = "";
        break;

      case "goto": // Keep old command as alias
        executeCommand(`cd ${arg}`);
        break;

      case "socials":
        printOutput("GitHub | LinkedIn");
        window.open("https://github.com/SwayamPurwar", "_blank");
        break;

      case "whoami":
        printOutput(
          "Guest User [IP: " +
            (Math.floor(Math.random() * 255) + 1) +
            ".0.0.1]. Access Level: Visitor.",
        );
        break;

      case "matrix":
        printOutput("Initializing Matrix...");
        toggleMatrix(true);
        break;

      case "color":
        if (arg) {
          document.documentElement.style.setProperty("--accent", arg);
          const glow = document.getElementById("ambient-glow");
          if (glow)
            glow.style.background = `radial-gradient(circle, ${arg}40 0%, rgba(0, 0, 0, 0) 70%)`;
          printOutput(`SUCCESS: System accent changed to ${arg}`);
          sfx.playBoot();
        } else
          printOutput("Error: Please specify a color (e.g., color #ff0000).");
        break;

      case "blackout":
      case "shutdown":
        printOutput("INITIATING SYSTEM POWER CUT...", true);
        setTimeout(toggleBlackout, 800);
        break;

      case "gravity":
        printOutput("WARNING: ARTIFICIAL GRAVITY GENERATORS FAILING...", true);
        setTimeout(() => {
          printOutput("CRITICAL ERROR: STRUCTURE UNSTABLE.");
          initGravity();
        }, 1000);
        break;

      case "theme":
        if (arg === "blueprint") {
          document.body.className = "theme-blueprint";
          printOutput("System reloaded: BLUEPRINT.");
        } else if (arg === "paper") {
          document.body.className = "theme-paper";
          printOutput("System reloaded: ANALOG.");
        } else if (arg === "reset" || arg === "default") {
          document.body.className = "";
          printOutput("System restored.");
        } else printOutput("Themes available: blueprint, paper, reset");
        break;

      case "ai":
      case "chat":
        isAiMode = true;
        printOutput("S.A.M. v1.0 ONLINE. Talk to me.");
        break;

      default:
        printOutput(`Command not found: '${cmd}'. Type 'help' for options.`);
    }
  }

  function processAiQuery(input) {
    const text = input.toLowerCase();
    let response = "";
    let action = null;

    // --- ENHANCED IDENTITY & STORY ---
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      response =
        "Greetings. I am S.A.M. (System Access Manager). My sensors detect a visitor. How can I help you navigate Swayam's world?";
    } else if (text.includes("who is swayam") || text.includes("developer")) {
      response =
        "Swayam is a Creative Developer based in Bhopal, India. He builds high-end digital products with a focus on motion and cinematic code.";
    } else if (
      text.includes("meaning of sam") ||
      text.includes("what is sam")
    ) {
      response =
        "I am the System Access Manager. I was compiled to act as the interface between human curiosity and the source code of this portfolio.";
    }

    // --- PROJECT DEEP DIVES ---
    else if (text.includes("kite")) {
      response =
        "Kite is a premium project management tool. Swayam focused on the 'Glassmorphism' UI and smooth state transitions using GSAP.";
    } else if (text.includes("apple music")) {
      response =
        "The Apple Music Redesign experiment explores spatial UI and immersive audio-visual sync. It is one of Swayam's favorite experiments.";
    } else if (text.includes("instagram")) {
      response =
        "The Instagram redesign focused on a minimal, dark-themed aesthetic with custom gesture-based navigation.";
    }

    // --- PROFESSIONAL DATA ---
    else if (
      text.includes("hiring") ||
      text.includes("available") ||
      text.includes("work with you")
    ) {
      response =
        "Swayam is currently open to high-impact creative roles and freelance collaborations. You should check the 'contact' section immediately.";
    } else if (text.includes("education") || text.includes("study")) {
      response =
        "Accessing academic records... Swayam has a background in Computer Science, but he is largely a self-taught creative alchemist.";
    } else if (
      text.includes("linkedin") ||
      text.includes("github") ||
      text.includes("socials")
    ) {
      response =
        "Establishing secure connection to social nodes... Type 'socials' in the terminal or check the footer of the site.";
    } else if (
      text.includes("contact") ||
      text.includes("hire") ||
      text.includes("email")
    ) {
      response =
        "Protocol initiated: You can reach Swayam at swayampurwar111104@gmail.com or connect via LinkedIn. Type 'socials' for direct links.";
    }

    // --- INTERACTIVE SYSTEM COMMANDS ---
    else if (text.includes("color") || text.includes("change theme")) {
      response =
        "I can't pick for you, but I suggest trying: 'color #00ff00' for a classic hacker look.";
    } else if (text.includes("matrix") || text.includes("simulation")) {
      response = "Reality is a bit of code. Let me show you the strings.";
      action = () => toggleMatrix(true);
    } else if (text.includes("gravity") || text.includes("fall")) {
      response =
        "Warning: Physical constants are being rewritten. Brace for the collapse.";
      action = initGravity;
    } else if (text.includes("ls") || text.includes("files")) {
      response =
        "I see index.html, about.html, and several encrypted project files. Use 'ls' in standard mode to see them clearly.";
    }

    // --- FUN & PERSONALITY ---
   else if (text.includes("status") || text.includes("how are you")) {
        response = "Systems operational. Kernel uptime: 99.9%. My current mood is set to 'Efficient'.";
    } else if (text.includes("who are you") || text.includes("sam")) {
        response = "I am an Artificial Intelligence entity designed to manage this portfolio. I am the bridge between the user and the source code.";
    } else if (text.includes("who made you")) {
        response = "I was brought to life by Swayam Purwar's late-night coding sessions and too much caffeine.";
    } else if (text.includes("love") || text.includes("like you")) {
      response =
        "That is a very human emotion. I am flattered, but my heart is made of silicon and logic gates.";
    } else if (text.includes("joke")) {
      response =
        "Why did the web developer walk out of the restaurant? Because of the table layout.";
    } else if (text.includes("who made you")) {
      response =
        "I was brought to life by Swayam Purwar's late-night coding sessions and too much caffeine.";
    } else if (text.includes("location") || text.includes("live")) {
      response =
        "Operating from Bhopal, India. Coordinates: 23.2599° N, 77.4126° E.";
    } else if (text.includes("experience") || text.includes("cv")) {
      response =
        "Swayam has built immersive interfaces for various brands. Type 'cv' in the main terminal to see the full record.";
    }

    // --- NAVIGATION & EXIT ---
    else if (text.includes("go to about") || text.includes("navigation")) {
      response = "Rerouting you to the 'About' section... [INITIATING NAV]";
      action = () => {
        window.location.href = "about.html";
      };
    } else if (text === "exit" || text === "quit") {
      response = "AI session closed. Standard terminal protocol restored.";
      isAiMode = false;
    }
    // --- ADD TO processAiQuery ---
    else if (text.includes("loader") || text.includes("stuck")) {
      response =
        "The initialization sequence (loader) should have terminated. If I am visible, the system is operational. Try 'clear' if the view is obstructed.";
    } else if (text.includes("scroll") || text.includes("move")) {
      response =
        "My sensors indicate custom cursor interference. Use your trackpad or mouse-wheel; I have optimized the pointer-events for this terminal.";
    } else if (text.includes("github") || text.includes("source")) {
      response =
        "Accessing repository... You can find Swayam's source code at github.com/SwayamPurwar. Protocol: Socials.";
    } else if (text.includes("bhopal") || text.includes("madhya pradesh")) {
      response =
        "Correct. Swayam operates from the Heart of India, Bhopal. A city of lakes and logic.";
    }
    // --- FALLBACK ---1
    else {
      response =
        "Query '" +
        input +
        "' not found in my database. Try asking about 'Kite project', 'hiring status', or 'funny joke'.";
    }

    // --- UI EXECUTION (TYPING EFFECT) ---
    const loadingId = "ai-loading-" + Date.now();
    printOutput(
      `<span id="${loadingId}" style="color: #0f0">S.A.M. ></span> Thinking...`,
      true,
    );

    setTimeout(() => {
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement) loadingElement.parentElement.remove();

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
          if (action) setTimeout(action, 600);
        }
      }, 30);
    }, 800);
  }

  // Mobile God Mode trigger
  const logoTrigger = document.querySelector(".logo");
  let tapCount = 0,
    tapTimer;
  if (logoTrigger) {
    logoTrigger.addEventListener("click", (e) => {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (tapCount = 0), 500);
      if (tapCount === 3) {
        e.preventDefault();
        toggleTerminal();
        tapCount = 0;
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }
    });
  }
  document
    .getElementById("cmd-close-mobile")
    ?.addEventListener("click", toggleTerminal);
}
