import { sfx } from "./audio-system.js";
import { toggleMatrix, toggleBlackout, initGravity } from "./easter-eggs.js";
import gsap from "gsap";

// --- NEW: Firebase Imports ---
import { db } from "./firebase.js";
import {
  ref,
  push,
  onChildAdded,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
  query,
  limitToLast,
} from "firebase/database";

export function initTerminal() {
if (window.__TERMINAL_INITIALIZED__) return;
  window.__TERMINAL_INITIALIZED__ = true;
  
  const terminal = document.getElementById("cmd-terminal");
  const cmdInput = document.getElementById("cmd-input");
  const cmdOutput = document.getElementById("cmd-output");
  let isTerminalOpen = false;
  let isAiMode = false;
  let hasBooted = false;
  let isVimMode = false; // <-- 1. ADD THIS LINE

  // --- NEW: Multiplayer State Variables ---
  const userId = "guest_" + Math.random().toString(36).substr(2, 4);
  let onlineCount = 1;
  let isNetworkInitialized = false;

  // --- NEW: History Variables ---
  let commandHistory = JSON.parse(
    localStorage.getItem("swayam_term_history") || "[]",
  );
  let historyIndex = -1;
  if (!terminal || !cmdInput || !cmdOutput) return;

  // --- NEW: Tab Completion Dictionary ---
  // We will add our new God Mode commands to this list as we build them!
  const availableCommands = [
    "help",
    "ls",
    "cd",
    "pwd",
    "date",
    "history",
    "clear",
    "socials",
    "theme",
    "matrix",
    "blackout",
    "gravity",
    "ai",
    "cat",
    "decrypt",
  ];

  window.addEventListener("keydown", (e) => {
    const loader = document.querySelector(".preloader-container");
    if (loader && loader.style.display !== "none") return; // DO NOTHING
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // --- NEW: Initialize Firebase Network ---
  function initGlobalNetwork() {
    if (isNetworkInitialized) return;
    isNetworkInitialized = true;

    const presenceRef = ref(db, "presence/" + userId);
    const connectedRef = ref(db, ".info/connected");
    const allPresenceRef = ref(db, "presence");
    // Fetch last 15 messages max
    const messagesRef = query(ref(db, "messages"), limitToLast(15));

    // 1. Presence System: Track online users
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(presenceRef, true);
        onDisconnect(presenceRef).remove(); // Auto-removes when user leaves
      }
    });

    // 2. Count Online Users (Bulletproof method)
    onValue(allPresenceRef, (snap) => {
      const activeUsersData = snap.val();
      
      if (activeUsersData) {
        // This counts the actual number of connected users in the database
        onlineCount = Object.keys(activeUsersData).length; 
      } else {
        onlineCount = 1; // Fallback only if the database is literally completely empty
      }
      
      // Update the UI
      const countDisplay = document.getElementById("network-online-count");
      if (countDisplay) {
          countDisplay.innerText = onlineCount;
      }
    });

    // 3. Listen for incoming Global Messages
    let initialLoad = true;
    onChildAdded(messagesRef, (snap) => {
      if (initialLoad) return;
      const msg = snap.val();
      if (msg.sender !== userId && isTerminalOpen) {
        printOutput(
          `<span style="color: #00d2ff">[Global] ${msg.sender}:</span> ${msg.text}`,
          true,
        );
        if (sfx && sfx.playHover) sfx.playHover(); // Soft ping for new messages
      }
    });

    // Stop ignoring messages after 1 second (gives time to fetch history)
    setTimeout(() => {
      initialLoad = false;
    }, 1000);
  }

 function toggleTerminal() {
    isTerminalOpen = !isTerminalOpen;
    if (isTerminalOpen) {
      terminal.classList.add("active");

      // --- NEW: Accessibility Fixes for Opening ---
      terminal.setAttribute("aria-hidden", "false"); 
      terminal.removeAttribute("inert");


      cmdInput.value = "";
      cmdInput.focus();
      if (sfx && sfx.playClick) sfx.playClick();
      
      // Initialize network on first open
      initGlobalNetwork();
      
      // Only print the welcome sequence the VERY FIRST time they open it
      if (!hasBooted) {
          hasBooted = true;
          cmdOutput.innerHTML = "";
          setTimeout(() => {
            // 1. The Welcome Line
            printOutput("Welcome to S.A.M. Terminal. Type 'help' to see available commands.");
            
            // 2. The Global Network Line (with the ID for live updating!)
            printOutput(`<span style="color: #a855f7">🌐 GLOBAL NETWORK ONLINE: [<span id="network-online-count">${onlineCount || 1}</span> anonymous users connected]</span>`, true);
            
            // 3. The Hint Line
            printOutput(`<span style="color: #666">Hint: Unrecognized commands are broadcast globally to everyone online.</span>`, true);
            
            // Force an immediate UI update just in case Firebase loaded extremely fast
            const countDisplay = document.getElementById("network-online-count");
            if (countDisplay && onlineCount > 0) countDisplay.innerText = onlineCount;
          }, 300);
      }

    } else {
      terminal.classList.remove("active");

      // --- NEW: Accessibility Fixes for Closing ---
      terminal.setAttribute("aria-hidden", "true");
      terminal.setAttribute("inert", "");
      
      cmdInput.blur();
    }
  }

  function printOutput(text, isHTML = false) {
    const line = document.createElement("div");
    if (isHTML) line.innerHTML = text;
    else line.textContent = text;
    cmdOutput.appendChild(line);
  }

  // --- J.A.R.V.I.S. VOICE SYNTHESIS ---
  function speak(text) {
    if ("speechSynthesis" in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly faster than normal
      utterance.pitch = 0.9; // Slightly deeper, AI-sounding voice
      window.speechSynthesis.speak(utterance);
    }
  }

  cmdInput.addEventListener("keydown", (e) => {
    // --- NEW: Handle Tab Completion ---
    if (e.key === "Tab") {
      e.preventDefault(); // Prevents the browser from focusing off the input
      const input = cmdInput.value.trim().toLowerCase();
      // Find the first command that starts with whatever the user typed
      const match = availableCommands.find((c) => c.startsWith(input));
      if (match) cmdInput.value = match;
      return;
    }

    // --- Handle Arrow Keys (History Navigation) ---
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
    }
    // --- Handle Execution & Saving History ---
    else if (e.key === "Enter") {
      const input = cmdInput.value.trim();
      if (!input) return;

      // Save to history array
      commandHistory.push(input);
      // Cap history at 50 items so we don't bloat local storage
      if (commandHistory.length > 50) commandHistory.shift();
      // Save to browser's Local Storage
      localStorage.setItem(
        "swayam_term_history",
        JSON.stringify(commandHistory),
      );

      historyIndex = -1; // Reset index

      if (isVimMode) {
        // Hijack input if VIM is open
        printOutput(`<span style="color: #ccc">~ ${input}</span>`, true);
        handleVimMode(input);
      } else if (isAiMode) {
        printOutput(`<span style="color: #fff">You:</span> ${input}`, true);
        processAiQuery(input);
      } else {
        // Only print standard prompt if it IS a recognized local command
        const action = input.toLowerCase().split(" ")[0];
        const isLocalCmd =
          availableCommands.includes(action) ||
          [
            "whoami",
            "echo",
            "exit",
            "sudo",
            "npm",
            "voice",
            "analyze",
          ].includes(action);

        if (isLocalCmd) {
          printOutput(`user@swayam:~$ ${input}`);
        }
        executeCommand(input); // Pass original case to execute to preserve chat casing
      }

      cmdInput.value = "";
      cmdInput.focus();
      setTimeout(() => {
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
      }, 50);
    }
  });

  function executeCommand(cmdText) {
    const cmd = cmdText.toLowerCase();
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
                <div><span style="color: var(--accent); width: 100px; display: inline-block;">cat</span>      Read a file (e.g., 'cat filename')</div>
                
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
        printOutput(
          "index.html   about.html   work/   contact.exe   cv.pdf   <span style='color: #ff3b30'>secrets.enc</span>",
          true,
        );
        printOutput(
          "<span style='color: #666'>Hint: Use the 'cat' command to read files (e.g. 'cat about.html')</span>",
          true,
        );
        break;
      case "cat":
        if (arg === "secrets.enc") {
          printOutput(
            "ACCESS DENIED: File encrypted. To unlock, type 'decrypt [TODAY'S DATE NUMBER]'. Example: If today is the 15th, type 'decrypt 15'",
          );
        } else if (arg === "about.html") {
          printOutput(
            "&lt;h1&gt;About Swayam&lt;/h1&gt;<br>&lt;p&gt;Creative Developer. MERN Stack. UI/UX Enthusiast.&lt;/p&gt;",
            true,
          );
        } else if (arg === "index.html") {
          printOutput(
            "&lt;!DOCTYPE html&gt;<br>&lt;html&gt;<br>&lt;head&gt;&lt;title&gt;Swayam.OS&lt;/title&gt;&lt;/head&gt;<br>&lt;body&gt;System Online&lt;/body&gt;<br>&lt;/html&gt;",
            true,
          );
        } else if (arg === "cv.pdf") {
          printOutput(
            "ERR: Cannot render PDF in standard output. Please use GUI to view.",
          );
        } else if (arg === "contact.exe") {
          printOutput("ERR: cannot execute binary file: Exec format error");
        } else if (arg === "work" || arg === "work/") {
          printOutput("cat: work/: Is a directory");
        } else if (arg) {
          printOutput(`cat: ${arg}: Permission denied or file not found.`);
        } else {
          printOutput("Usage: cat [filename]");
        }
        break;

      case "decrypt":
        const today = new Date().getDate().toString();
        if (arg === today) {
          printOutput(
            `<span style='color: #0f0'>DECRYPTION SUCCESSFUL.</span><br>Congratulations! You found the Easter Egg. You are highly observant.<br>Direct Line: +91 98765 43210<br>Email: swayampurwar111104@gmail.com`,
            true,
          );
          sfx.playBoot();
        } else {
          printOutput(
            "<span style='color: #ff3b30'>DECRYPTION FAILED. INCORRECT KEY.</span>",
            true,
          );
          sfx.playClick();
        }
        break;

      // --- THE DOM DESTROYER ---
      case "sudo":
        if (arg === "rm -rf /") {
          printOutput(
            "<span style='color: #ff3b30'>WARNING: You are about to wipe the entire DOM. Type 'sudo rm -rf / --force' if you are absolutely sure.</span>",
            true,
          );
          if (sfx && sfx.playClick) sfx.playClick();
        } else if (arg === "rm -rf / --force") {
          printOutput(
            "<span style='color: #ff3b30'>INITIATING KERNEL PANIC... GOODBYE.</span>",
            true,
          );
          if (sfx && sfx.playBoot) sfx.playBoot();

          setTimeout(() => {
            document.getElementById("cmd-terminal").classList.remove("active");
            gsap.to("body > *:not(#cmd-terminal)", {
              y: window.innerHeight + 500,
              rotation: (i) => Math.random() * 90 - 45,
              opacity: 0,
              stagger: 0.05,
              duration: 2.5,
              ease: "power4.in",
              onComplete: () => {
                document.body.style.background = "#000";
                document.body.innerHTML =
                  "<div style='color:#0f0; font-family:monospace; padding:20px; font-size:1.2rem;'>System corrupted. Kernel panic. <br/><br/>Please refresh your browser to restore Swayam.OS.</div>";
              },
            });
          }, 1500);
        } else {
          printOutput(
            `user is not in the sudoers file. This incident will be reported.`,
          );
          if (sfx && sfx.playClick) sfx.playClick();
        }
        break;

      // --- NPM INJECTOR (CONFETTI) ---
      case "npm":
        if (arg === "install confetti" || arg === "i confetti") {
          printOutput("Fetching packages...");
          if (sfx && sfx.playHover) sfx.playHover();

          setTimeout(() => printOutput("Resolving dependencies..."), 500);

          setTimeout(() => {
            printOutput(
              "<span style='color:#0f0'>+ canvas-confetti@1.6.0</span><br>added 1 package in 1.2s",
              true,
            );
            const script = document.createElement("script");
            script.src =
              "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";

            script.onload = () => {
              window.confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#a855f7", "#00d2ff", "#ffffff"],
              });
              if (sfx && sfx.playBoot) sfx.playBoot();
            };
            document.body.appendChild(script);
          }, 1500);
        } else if (arg) {
          printOutput(
            `npm <span style='color:#ff3b30'>ERR!</span> code E404<br>npm <span style='color:#ff3b30'>ERR!</span> 404 Not Found - GET https://registry.npmjs.org/${arg}`,
            true,
          );
          if (sfx && sfx.playClick) sfx.playClick();
        } else {
          printOutput("Usage: npm install [package]");
        }
        break;

      // --- VOICE UI (J.A.R.V.I.S PROTOCOL) ---
      case "voice":
        if (arg === "init") {
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

          if (!SpeechRecognition) {
            printOutput(
              "<span style='color:#ff3b30'>ERR: Voice module not supported. Please use Google Chrome or Edge.</span>",
              true,
            );
            if (sfx && sfx.playClick) sfx.playClick();
            return;
          }

          const recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          recognition.interimResults = false;

          printOutput(
            "<span style='color:#0f0'>MICROPHONE LIVE. Waiting for audio...</span>",
            true,
          );
          if (sfx && sfx.playBoot) sfx.playBoot();

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            printOutput(`[Voice Recognized]: "${transcript}"`);

            if (transcript.includes("dark") || transcript.includes("black")) {
              executeCommand("theme reset");
              speak("Dark mode engaged.");
            } else if (
              transcript.includes("matrix") ||
              transcript.includes("hack")
            ) {
              executeCommand("matrix");
              speak("Welcome to the real world.");
            } else if (
              transcript.includes("about") ||
              transcript.includes("who")
            ) {
              executeCommand("cd about");
              speak("Navigating to the about page.");
            } else if (
              transcript.includes("destroy") ||
              transcript.includes("delete")
            ) {
              speak("Initiating self destruct sequence.");
              executeCommand("sudo rm -rf / --force");
            } else {
              speak("I heard you, but I don't have a command for that yet.");
            }
          };

          recognition.onerror = (event) => {
            if (event.error === "not-allowed") {
              printOutput(
                "<span style='color:#ff3b30'>ERR: Microphone Access Denied.</span><br>Check the camera/mic icon in your URL bar to allow access.",
                true,
              );
            } else if (event.error === "network") {
              printOutput(
                "<span style='color:#ff3b30'>ERR: Secure Connection Failed.</span><br>Browser could not reach speech servers. This is often caused by local dev environments, VPNs, or strict firewalls.",
                true,
              );
            } else {
              printOutput(
                `<span style='color:#ff3b30'>VOICE ERR: ${event.error}</span>`,
                true,
              );
            }
            if (sfx && sfx.playClick) sfx.playClick();
          };

          recognition.onspeechend = () => {
            recognition.stop();
          };

          try {
            recognition.start();
          } catch (e) {
            printOutput(
              `<span style='color:#ff3b30'>CRASH: ${e.message}</span>`,
              true,
            );
          }
        } else {
          printOutput("Usage: voice init");
        }
        break;

      case "cd":
        if (arg === ".." || arg === "home" || arg === "index" || arg === "~") {
          window.location.href = "index.jsx";
          printOutput("Navigating to /home...");
        } else if (arg === "about") {
          window.location.href = "about.jsx";
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

      // --- FAKE VIM EDITOR ---
      case "vim":
        if (arg === "styles.css") {
          isVimMode = true;
          cmdOutput.innerHTML = "";
          printOutput(
            "<span style='color: var(--accent)'>--- VIM MODE ACTIVATED ---</span>",
            true,
          );
          printOutput("Editing: styles.css");
          printOutput(
            "Hint: Type 'color [hex]' to change the site theme instantly (e.g., 'color #ff3b30').",
          );
          printOutput("Type ':wq' to save and exit.");
        } else {
          printOutput(`vim: Cannot open file. Try 'vim styles.css'`);
        }
        break;

      // --- TARGET ANALYZER ---
      case "analyze":
        printOutput("INITIATING TARGET SCAN...", true);
        sfx.playHover();

        setTimeout(() => {
          let os = "Unknown OS";
          let browser = "Unknown Agent";

          if (navigator.userAgentData) {
            os = navigator.userAgentData.platform || os;
            const brands = navigator.userAgentData.brands;
            if (brands && brands.length > 0) {
              const realBrand = brands.find(
                (b) =>
                  !b.brand.includes("Not") && !b.brand.includes("Chromium"),
              );
              browser = realBrand
                ? realBrand.brand
                : brands[brands.length - 1].brand;
            }
          } else {
            const ua = navigator.userAgent;
            if (ua.includes("Firefox")) browser = "Mozilla Firefox";
            else if (ua.includes("Safari") && !ua.includes("Chrome"))
              browser = "Apple Safari";
            else if (ua.includes("Edg")) browser = "Microsoft Edge";
            else if (ua.includes("Chrome")) browser = "Google Chrome";

            if (ua.includes("Win")) os = "Windows";
            else if (ua.includes("Mac")) os = "macOS";
            else if (ua.includes("Linux")) os = "Linux";
            else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
            else if (ua.includes("Android")) os = "Android";
          }

          const cores = navigator.hardwareConcurrency
            ? `${navigator.hardwareConcurrency} Logical Cores`
            : "Masked by Browser Security";
          const mem = navigator.deviceMemory
            ? `>=${navigator.deviceMemory}GB (Browser Capped)`
            : "Encrypted";

          let output = `<br><span style="color:#0f0">[TARGET DOSSIER]</span><br>SYSTEM: ${os}<br>CPU: ${cores}<br>EST RAM: ${mem}<br>AGENT: ${browser}<br>`;

          if ("getBattery" in navigator) {
            navigator
              .getBattery()
              .then((battery) => {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? "PLUGGED IN" : "DRAINING";
                printOutput(
                  output +
                    `POWER: ${level}% (${charging})<br><span style="color:#ff3b30">STATUS: COMPROMISED</span>`,
                  true,
                );
                sfx.playBoot();
              })
              .catch(() => {
                printOutput(
                  output +
                    `POWER: Access Denied by OS<br><span style="color:#ff3b30">STATUS: COMPROMISED</span>`,
                  true,
                );
                sfx.playBoot();
              });
          } else {
            printOutput(
              output +
                `POWER: Blocked by Browser Privacy<br><span style="color:#ff3b30">STATUS: COMPROMISED</span>`,
              true,
            );
            sfx.playBoot();
          }
        }, 1500);
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
        toggleTerminal();
        break;

      case "clear":
      case "cls":
        cmdOutput.innerHTML = "";
        break;

      case "goto":
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

      // --- NEW: THE MAGIC BULLET (GLOBAL CHAT FALLBACK) ---
      default:
        if (cmdText.trim() === "") break;

        // Push unrecognized commands to Firebase
        push(ref(db, "messages"), {
          text: cmdText, // Send the original raw text with casing
          sender: userId,
          timestamp: serverTimestamp(),
        }).catch((err) => {
          console.error("Firebase chat error:", err);
          printOutput(
            `<span style="color:#ff3b30">Network offline. Message failed.</span>`,
            true,
          );
        });

        // Print locally so the user sees their own message immediately
        printOutput(
          `<span style="color: #00d2ff">[Global] You:</span> ${cmdText}`,
          true,
        );
        break;
    }
  }

  function handleVimMode(input) {
    const cmd = input.toLowerCase();

    if (cmd === ":wq" || cmd === ":q") {
      isVimMode = false;
      cmdOutput.innerHTML = "";
      printOutput("styles.css saved. VIM mode exited.");
    } else if (cmd.startsWith("color ")) {
      const color = input.split(" ")[1];
      document.documentElement.style.setProperty("--accent", color);

      const glow = document.getElementById("ambient-glow");
      if (glow) {
        glow.style.background = `radial-gradient(circle, ${color}40 0%, rgba(0, 0, 0, 0) 70%)`;
      }

      printOutput(
        `Applied CSS: <span style="color: ${color}">--accent: ${color};</span>`,
        true,
      );
      if (sfx && sfx.playBoot) sfx.playBoot();
    } else {
      printOutput("VIM: Unknown command. Use 'color [hex]' or ':wq'");
      if (sfx && sfx.playClick) sfx.playClick();
    }
  }

  function processAiQuery(input) {
    const text = input.toLowerCase();
    let response = "";
    let action = null;

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
    } else if (text.includes("loading") || text.includes("lock")) {
      response =
        "During the initialization sequence, I restricted all hardware inputs to ensure a stable kernel boot. Full system access is now granted.";
    } else if (text.includes("kite")) {
      response =
        "Kite is a premium project management tool. Swayam focused on the 'Glassmorphism' UI and smooth state transitions using GSAP.";
    } else if (text.includes("apple music")) {
      response =
        "The Apple Music Redesign experiment explores spatial UI and immersive audio-visual sync. It is one of Swayam's favorite experiments.";
    } else if (text.includes("instagram")) {
      response =
        "The Instagram redesign focused on a minimal, dark-themed aesthetic with custom gesture-based navigation.";
    } else if (
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
    } else if (text.includes("color") || text.includes("change theme")) {
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
    } else if (text.includes("status") || text.includes("how are you")) {
      response =
        "Systems operational. Kernel uptime: 99.9%. My current mood is set to 'Efficient'.";
    } else if (text.includes("who are you") || text.includes("sam")) {
      response =
        "I am an Artificial Intelligence entity designed to manage this portfolio. I am the bridge between the user and the source code.";
    } else if (text.includes("who made you")) {
      response =
        "I was brought to life by Swayam Purwar's late-night coding sessions and too much caffeine.";
    } else if (text.includes("love") || text.includes("like you")) {
      response =
        "That is a very human emotion. I am flattered, but my heart is made of silicon and logic gates.";
    } else if (text.includes("joke")) {
      response =
        "Why did the web developer walk out of the restaurant? Because of the table layout.";
    } else if (text.includes("location") || text.includes("live")) {
      response =
        "Operating from Bhopal, India. Coordinates: 23.2599° N, 77.4126° E.";
    } else if (text.includes("experience") || text.includes("cv")) {
      response =
        "Swayam has built immersive interfaces for various brands. Type 'cv' in the main terminal to see the full record.";
    } else if (text.includes("go to about") || text.includes("navigation")) {
      response = "Rerouting you to the 'About' section... [INITIATING NAV]";
      action = () => {
        window.location.href = "about.html";
      };
    } else if (text === "exit" || text === "quit") {
      response = "AI session closed. Standard terminal protocol restored.";
      isAiMode = false;
    } else if (text.includes("loader") || text.includes("stuck")) {
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
    } else {
      response =
        "Query '" +
        input +
        "' not found in my database. Try asking about 'Kite project', 'hiring status', or 'funny joke'.";
    }

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

  let tapCount = 0,
    tapTimer;

  document.addEventListener("click", (e) => {
    const clickedLogo = e.target.closest(".logo");
    if (clickedLogo) {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (tapCount = 0), 500);

      if (tapCount === 3) {
        e.preventDefault();
        toggleTerminal();
        tapCount = 0;
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }
    }
  });

  document
    .getElementById("cmd-close-mobile")
    ?.addEventListener("click", toggleTerminal);
}
