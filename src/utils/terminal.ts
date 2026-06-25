import { sfx } from "./audio-system";
import { toggleMatrix, toggleBlackout, initGravity } from "./easter-eggs";
import gsap from "gsap";

// --- Firebase Imports ---
import { db } from "./firebase";
import { ref, push, onChildAdded, onValue, onDisconnect, set, serverTimestamp, query, limitToLast } from "firebase/database";

// TS global definition
declare global {
  interface Window {
    __TERMINAL_INITIALIZED__?: boolean;
    confetti?: any;
  }
}

export function initTerminal() {
  if (typeof window === "undefined" || window.__TERMINAL_INITIALIZED__) return;
  window.__TERMINAL_INITIALIZED__ = true;
  
  const terminal = document.getElementById("cmd-terminal");
  const cmdInput = document.getElementById("cmd-input") as HTMLInputElement;
  const cmdOutput = document.getElementById("cmd-output");
  
  let isTerminalOpen = false;
  let isAiMode = false;
  let hasBooted = false;
  let isVimMode = false; 

  // --- Multiplayer State Variables ---
  const userId = "guest_" + Math.random().toString(36).substring(2, 6);
  let onlineCount = 1;
  let isNetworkInitialized = false;

  // --- History Variables ---
  let commandHistory: string[] = JSON.parse(localStorage.getItem("swayam_term_history") || "[]");
  let historyIndex = -1;
  
  if (!terminal || !cmdInput || !cmdOutput) return;

  const availableCommands = [
    "help", "ls", "cd", "pwd", "date", "history", "clear", 
    "socials", "theme", "matrix", "blackout", "gravity", "ai", "cat", "decrypt"
  ];

  window.addEventListener("keydown", (e) => {
    const loader = document.querySelector(".preloader-container") as HTMLElement;
    if (loader && loader.style.display !== "none") return; 
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      toggleTerminal();
    }
  });

  function initGlobalNetwork() {
    if (isNetworkInitialized) return;
    isNetworkInitialized = true;

    const presenceRef = ref(db, "presence/" + userId);
    const connectedRef = ref(db, ".info/connected");
    const allPresenceRef = ref(db, "presence");
    const messagesRef = query(ref(db, "messages"), limitToLast(15));

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(presenceRef, true);
        onDisconnect(presenceRef).remove();
      }
    });

    onValue(allPresenceRef, (snap) => {
      const activeUsersData = snap.val();
      onlineCount = activeUsersData ? Object.keys(activeUsersData).length : 1; 
      
      const countDisplay = document.getElementById("network-online-count");
      if (countDisplay) countDisplay.innerText = onlineCount.toString();
    });

    let initialLoad = true;
    onChildAdded(messagesRef, (snap) => {
      if (initialLoad) return;
      const msg = snap.val();
      if (msg.sender !== userId && isTerminalOpen) {
        printOutput(`<span style="color: #00d2ff">[Global] ${msg.sender}:</span> ${msg.text}`, true);
        if (sfx && sfx.playHover) sfx.playHover();
      }
    });

    setTimeout(() => { initialLoad = false; }, 1000);
  }

 function toggleTerminal() {
    isTerminalOpen = !isTerminalOpen;
    if (isTerminalOpen) {
      document.body.style.overflow = "hidden";
      terminal!.classList.add("active");
      terminal!.setAttribute("aria-hidden", "false"); 
      terminal!.removeAttribute("inert");

      cmdInput.value = "";
      cmdInput.focus();
      if (sfx && sfx.playClick) sfx.playClick();
      
      initGlobalNetwork();
      
      if (!hasBooted) {
          hasBooted = true;
          cmdOutput!.innerHTML = "";
          setTimeout(() => {
            printOutput("Welcome to S.A.M. Terminal. Type 'help' to see available commands.");
            printOutput(`<span style="color: #a855f7">🌐 GLOBAL NETWORK ONLINE: [<span id="network-online-count">${onlineCount || 1}</span> anonymous users connected]</span>`, true);
            printOutput(`<span style="color: #666">Hint: Unrecognized commands are broadcast globally to everyone online.</span>`, true);
            
            const countDisplay = document.getElementById("network-online-count");
            if (countDisplay && onlineCount > 0) countDisplay.innerText = onlineCount.toString();
          }, 300);
      }
    } else {
      document.body.style.overflow = "";
      terminal!.classList.remove("active");
      terminal!.setAttribute("aria-hidden", "true");
      terminal!.setAttribute("inert", "true");
      cmdInput.blur();
    }
  }

  function printOutput(text: string, isHTML = false) {
    const line = document.createElement("div");
    if (isHTML) line.innerHTML = text;
    else line.textContent = text;
    cmdOutput!.appendChild(line);
  }

  function speak(text: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; 
      utterance.pitch = 0.9; 
      window.speechSynthesis.speak(utterance);
    }
  }

  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); 
      const input = cmdInput.value.trim().toLowerCase();
      const match = availableCommands.find((c) => c.startsWith(input));
      if (match) cmdInput.value = match;
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        cmdInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        cmdInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
      } else {
        historyIndex = -1;
        cmdInput.value = "";
      }
    } else if (e.key === "Enter") {
      const input = cmdInput.value.trim();
      if (!input) return;

      commandHistory.push(input);
      if (commandHistory.length > 50) commandHistory.shift();
      localStorage.setItem("swayam_term_history", JSON.stringify(commandHistory));

      historyIndex = -1; 

      if (isVimMode) {
        printOutput(`<span style="color: #ccc">~ ${input}</span>`, true);
        handleVimMode(input);
      } else if (isAiMode) {
        printOutput(`<span style="color: #fff">You:</span> ${input}`, true);
        processAiQuery(input);
      } else {
        const action = input.toLowerCase().split(" ")[0];
        const isLocalCmd = availableCommands.includes(action) || 
          ["whoami", "echo", "exit", "sudo", "npm", "voice", "analyze"].includes(action);

        if (isLocalCmd) {
          printOutput(`user@swayam:~$ ${input}`);
        }
        executeCommand(input); 
      }

      cmdInput.value = "";
      cmdInput.focus();
      setTimeout(() => {
        cmdOutput!.scrollTop = cmdOutput!.scrollHeight;
      }, 50);
    }
  });

  function executeCommand(cmdText: string) {
    const cmd = cmdText.toLowerCase();
    const parts = cmd.split(" ");
    const action = parts[0];
    const arg = parts.slice(1).join(" "); 

    switch (action) {
      case "help":
        const helpHTML = `
                <div style="color: #666; margin-bottom: 5px; margin-top: 5px;">--- BASIC COMMANDS ---</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">ls</span>       List directory contents</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">cd</span>       Change directory</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">pwd</span>      Print working directory</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">clear</span>    Clear terminal screen</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">cat</span>      Read a file</div>
                <div style="color: #666; margin-bottom: 5px; margin-top: 15px;">--- EXPERIMENTS ---</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">matrix</span>   Toggle visual effect</div>
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">ai</span>       Load Artificial Intelligence</div>
                `;
        printOutput(helpHTML, true);
        break;

      case "ls":
      case "dir":
        printOutput("about   contact   work   resume   <span style='color: #ff3b30'>secrets.enc</span>", true);
        break;

      case "cd":
      case "goto":
        if (arg === ".." || arg === "home" || arg === "~") {
          window.location.href = "/";
          printOutput("Navigating to /...");
        } else if (arg === "about" || arg === "contact" || arg === "resume") {
          window.location.href = `/${arg}`;
          printOutput(`Navigating to /${arg}...`);
        } else if (arg === "work") {
          window.location.href = "/#work";
          printOutput("Navigating to /#work...");
        } else {
          printOutput(`bash: cd: ${arg}: No such directory`);
        }
        break;

      case "cat":
        if (arg === "secrets.enc") printOutput("ACCESS DENIED: File encrypted.");
        else if (arg === "about") printOutput("&lt;h1&gt;About&lt;/h1&gt;", true);
        else printOutput(`cat: ${arg}: Permission denied or not found.`);
        break;

      case "clear":
      case "cls":
        cmdOutput!.innerHTML = "";
        break;

      case "ai":
      case "chat":
        isAiMode = true;
        printOutput("S.A.M. v1.0 ONLINE. Talk to me.");
        break;
        
      case "matrix":
        printOutput("Initializing Matrix...");
        toggleMatrix(true);
        break;

      case "blackout":
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

      case "exit":
      case "gui":
        toggleTerminal();
        break;

      default:
        if (cmdText.trim() === "") break;

        push(ref(db, "messages"), {
          text: cmdText, 
          sender: userId,
          timestamp: serverTimestamp(),
        }).catch(() => {
          printOutput(`<span style="color:#ff3b30">Network offline. Message failed.</span>`, true);
        });

        printOutput(`<span style="color: #00d2ff">[Global] You:</span> ${cmdText}`, true);
        break;
    }
  }

  function handleVimMode(input: string) {
    if (input.toLowerCase() === ":wq") {
      isVimMode = false;
      printOutput("Exited VIM.");
    }
  }

  function processAiQuery(input: string) {
    const text = input.toLowerCase();
    let response = "Query not found. Try asking about 'Swayam Capital project' or 'contact'.";
    let action: (() => void) | null = null;

    if (text.includes("hello")) response = "Greetings. I am S.A.M. How can I help?";
    else if (text.includes("swayam")) response = "Swayam is a Creative Developer based in Pune, India.";
    else if (text.includes("exit")) { response = "Session closed."; isAiMode = false; }
    else if (text.includes("matrix")) { response = "Entering the real world."; action = () => toggleMatrix(true); }

    const loadingId = "ai-loading-" + Date.now();
    printOutput(`<span id="${loadingId}" style="color: #0f0">S.A.M. ></span> Thinking...`, true);

    setTimeout(() => {
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement && loadingElement.parentElement) loadingElement.parentElement.remove();

      const line = document.createElement("div");
      line.innerHTML = `<span style="color: #0f0">S.A.M. ></span> `;
      cmdOutput!.appendChild(line);

      let i = 0;
      const typeInterval = setInterval(() => {
        line.innerHTML += response.charAt(i);
        cmdOutput!.scrollTop = cmdOutput!.scrollHeight;
        i++;
        if (i >= response.length) {
          clearInterval(typeInterval);
          if (action) setTimeout(action, 600);
        }
      }, 30);
    }, 800);
  }

  let tapCount = 0, tapTimer: NodeJS.Timeout;
  document.addEventListener("click", (e) => {
    const clickedLogo = (e.target as HTMLElement).closest(".logo");
    if (clickedLogo) {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (tapCount = 0), 500);

      if (tapCount === 3) {
        e.preventDefault();
        toggleTerminal();
        tapCount = 0;
      }
    }
  });

  document.getElementById("cmd-close-mobile")?.addEventListener("click", toggleTerminal);
}