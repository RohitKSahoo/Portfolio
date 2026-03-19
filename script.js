'use strict';

/* ============================================================
   BIOS-STYLE BOOT SEQUENCE  — with skip-on-keypress
============================================================ */
(function () {
    const bootScreen = document.getElementById("boot-screen");
    const bootText   = document.getElementById("boot-text");
    const progressBar = document.getElementById("boot-progress-bar");
    const body       = document.body;

    body.classList.add("booting");

    if (!bootScreen || !bootText) {
        body.classList.remove("booting");
        body.classList.add("boot-complete");
        return;
    }

    let skipped = false;

    // Any key skips the boot immediately
    function skipBoot() {
        if (skipped) return;
        skipped = true;
        finishBoot();
    }

    document.addEventListener("keydown", skipBoot, { once: true });
    bootScreen.addEventListener("click", skipBoot, { once: true });

    const lines = [
        "ROHIT BIOS v1.9  (C) 2025 Rohit Systems, Inc.",
        "Main Processor : Intel(R) Core(TM) i7 Virtual @ 3.60GHz",
        "Memory Testing : 16384MB OK",
        "",
        "Detecting IDE Drives...",
        "  SATA0: 512GB NVMe SSD            OK",
        "  SATA1: USB BOOT DEVICE           OK",
        "",
        "Checking system configuration...   OK",
        "Loading RohitOS Portfolio Loader...",
        "Initializing Terminal Shell...",
        "",
        "Boot Priority: [RohitOS-Portfolio]",
        "Starting RohitOS..."
    ];

    let lineIndex = 0;

    function typeLine() {
        if (skipped) return;
        if (lineIndex >= lines.length) { finishBoot(); return; }

        const line = lines[lineIndex];
        let charIndex = 0;

        function typeChar() {
            if (skipped) return;
            if (charIndex < line.length) {
                bootText.textContent += line[charIndex];
                charIndex++;
                setTimeout(typeChar, 5);
            } else {
                bootText.textContent += "\n";
                lineIndex++;
                if (progressBar) progressBar.style.width = Math.round((lineIndex / lines.length) * 100) + "%";
                setTimeout(typeLine, line.trim() === "" ? 40 : 80);
            }
        }
        typeChar();
    }

    function finishBoot() {
        if (progressBar) progressBar.style.width = "100%";
        setTimeout(() => {
            bootScreen.classList.add("fade-out");
            bootScreen.addEventListener("animationend", () => {
                bootScreen.remove();
                body.classList.remove("booting");
                body.classList.add("boot-complete");
                // After boot, start the welcome typewriter
                startWelcomeTypewriter();
            }, { once: true });
        }, 300);
    }

    window.addEventListener("load", () => typeLine());
})();


/* ============================================================
   MATRIX BACKGROUND
============================================================ */
const canvas = document.getElementById("matrix-bg");
const ctx    = canvas.getContext("2d");

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*".split("");
let fontSize = 16;
let columns, drops;

function resizeMatrix() {
    const panel = document.querySelector(".visual-panel");
    if (!panel) return;
    canvas.width  = panel.offsetWidth;
    canvas.height = panel.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops   = Array(columns).fill(1);
}

resizeMatrix();

function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4af626";
    ctx.font = `${fontSize}px monospace`;
    drops.forEach((drop, i) => {
        const char = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(char, i * fontSize, drop * fontSize);
        if (drop * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

setInterval(drawMatrix, 35);
window.addEventListener("resize", resizeMatrix);


/* ============================================================
   DRAGGABLE SPLITTER
============================================================ */
const dragBar      = document.getElementById("drag-bar");
const visualPanel  = document.querySelector(".visual-panel");
const terminalPanel = document.querySelector(".terminal-panel");
const mainEl       = document.querySelector("main");

if (dragBar && visualPanel && terminalPanel && mainEl) {
    let dragging = false;
    dragBar.addEventListener("mousedown", () => { dragging = true; document.body.style.userSelect = "none"; });
    window.addEventListener("mouseup",    () => { dragging = false; document.body.style.userSelect = ""; });
    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const rect = mainEl.getBoundingClientRect();
        let newW = Math.max(260, Math.min(rect.width * 0.75, e.clientX - rect.left));
        visualPanel.style.width = newW + "px";
        resizeMatrix();
    });
}


/* ============================================================
   3D CARD TILT + FLIP + ACCESS BADGE FADE
============================================================ */
const cardContainer = document.getElementById("card-3d-container");
const card          = document.getElementById("card-3d");
const light         = document.getElementById("light");
const cardHint      = document.getElementById("card-hint");

let flipped = false;

if (cardContainer && card) {
    if (light) {
        cardContainer.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;
            const rect    = cardContainer.getBoundingClientRect();
            const x       = e.clientX - rect.left;
            const y       = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotX    = ((y - centerY) / centerY) * -18;
            const rotY    = ((x - centerX) / centerX) * 18;
            card.style.transform = `rotateX(${rotX}deg) rotateY(${flipped ? rotY + 180 : rotY}deg)`;
            light.style.transform = `translate(${(x / rect.width) * 100}%, ${(y / rect.height) * 100}%)`;
        });
    }

    cardContainer.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 768) return;
        card.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
    });

    cardContainer.addEventListener("click", () => {
        flipped = !flipped;
        card.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
        if (cardHint) {
            cardHint.textContent = flipped ? "▼ click to close" : "▲ click card to flip";
        }
    });
}


/* ============================================================
   HUD LATENCY COUNTER
============================================================ */
(function() {
    const hudBr = document.getElementById("hud-br");
    if (!hudBr) return;
    function pingLatency() {
        const start = performance.now();
        // simulate a tiny "ping" by measuring a rAF round trip
        requestAnimationFrame(() => {
            const lat = Math.round(performance.now() - start);
            hudBr.textContent = `LAT:${lat}ms`;
        });
    }
    setInterval(pingLatency, 2000);
    pingLatency();
})();


/* ============================================================
   TERMINAL COMMANDS
============================================================ */
const allCommands = {
    help: () => `<span style="color:#4af626;font-weight:bold">Available commands:</span>
  <span class="nav-cmd" data-cmd="about">about</span>       − Who I am
  <span class="nav-cmd" data-cmd="projects">projects</span>    − Things I've built
  <span class="nav-cmd" data-cmd="skills">skills</span>      − My tech stack & proficiencies
  <span class="nav-cmd" data-cmd="experience">experience</span>  − My background & timeline
  <span class="nav-cmd" data-cmd="contact">contact</span>     − How to reach me
  <span class="nav-cmd" data-cmd="resume">resume</span>      − View / download my resume
  <span class="nav-cmd" data-cmd="clear">clear</span>       − Clear the terminal
  
  <span style="color:#555">Easter eggs: whoami | sudo | ls | cat | history | matrix | uptime</span>`,

    about: () => `<span style="color:#4af626;font-weight:bold">> ABOUT.TXT</span>
―――――――――――――――――――――――――――――――――
Hey, I'm <span style="color:#fff">Rohit Kumar Sahoo</span> — a Computer Science student based in India.

I got drawn into tech not by career plans but by pure curiosity. I started
fiddling with small C programs, then moved to Python for automation, and
now I can't stop building things in JavaScript on the browser.

Right now I'm obsessed with:
  ★  Making interfaces that <span style="color:#4af626">feel alive</span> (animations, 3D, terminal UIs)
  ★  Understanding how things actually work — not just "using" them
  ★  Pushing through CS fundamentals the hard way (data structures, OS, etc.)

Outside code I enjoy:
  ↳  Gaming (strategy / open world)
  ↳  Tech rabbit holes at 2am
  ↳  Overthinking simple animations

<span style="color:#555">Type "projects" to see what I've built, or "contact" to say hi.</span>`,

    projects: () => `<span style="color:#4af626;font-weight:bold">> PROJECTS.LOG</span>
―――――――――――――――――――――――――――――――――

<span style="color:#fff">01. BIOS-THEMED PORTFOLIO</span>  <span style="color:#4af626">[LIVE]</span>
    A developer portfolio that boots like a BIOS, with a matrix rain
    background, 3D tilt ID card, and a functional terminal interface.
    Stack: HTML · CSS · Vanilla JS · Canvas API
    Repo: <a href="https://github.com/RohitKSahoo/Portfolio" class="term-link" target="_blank">github.com/RohitKSahoo/Portfolio</a>

<span style="color:#fff">02. TERMINAL SNAKE GAME</span>  <span style="color:#888">[WIP]</span>
    Classic snake reimagined as an ASCII game in the browser terminal.
    Stack: JavaScript · Canvas
    Repo: <a href="https://github.com/RohitKSahoo" class="term-link" target="_blank">github.com/RohitKSahoo</a>

<span style="color:#fff">03. C DATA STRUCTURES LIBRARY</span>  <span style="color:#888">[PERSONAL]</span>
    Hand-rolled implementations of linked lists, stacks, queues, trees, and
    hash maps in C — for learning and reference.
    Stack: C · Makefile

<span style="color:#fff">04. PYTHON AUTOMATION SCRIPTS</span>  <span style="color:#888">[PERSONAL]</span>
    A collection of scripts for file organisation, web scraping, and quick
    utilities I actually use day-to-day.
    Stack: Python · requests · pathlib

<span style="color:#555">More experiments: <a href="https://github.com/RohitKSahoo" class="term-link" target="_blank">github.com/RohitKSahoo</a></span>`,

    skills: () => `<span style="color:#4af626;font-weight:bold">> SKILLS.SH</span>
―――――――――――――――――――――――――――――――――

<span style="color:#fff">LANGUAGES</span>
  C           <span class="skill-star">█████</span>░░░  Intermediate
  C++         <span class="skill-star">████</span>░░░░  Beginner–Mid
  Python      <span class="skill-star">████</span>░░░░  Comfortable
  JavaScript  <span class="skill-star">█████</span>░░░  Intermediate

<span style="color:#fff">WEB</span>
  HTML5       <span class="skill-star">███████</span>░  Strong
  CSS3        <span class="skill-star">██████</span>░░  Solid
  Canvas API  <span class="skill-star">████</span>░░░░  Learning

<span style="color:#fff">TOOLS & WORKFLOW</span>
  Git / GitHub  <span class="skill-star">█████</span>░░░  Daily driver
  VS Code       <span class="skill-star">███████</span>░  Power user
  Linux terminal<span class="skill-star">█████</span>░░░  Comfortable

<span style="color:#fff">CURRENTLY EXPLORING</span>
  → React.js   → Node.js basics   → Three.js   → SQL`,

    experience: () => `<span style="color:#4af626;font-weight:bold">> EXPERIENCE.LOG</span>
―――――――――――――――――――――――――――――――――

<span style="color:#fff">EDUCATION</span>
  B.Tech in Computer Science & Engineering
  <span style="color:#888">2024 – 2028 · In progress</span>
  Coursework: Data Structures, OOP, OS, DBMS, Discrete Math

<span style="color:#fff">SELF-TAUGHT TRACK</span>
  <span style="color:#888">2022 – present</span>
  ↳  Started with C (logic, pointers, memory management)
  ↳  Moved to Python — automation, scripting, small tools
  ↳  Fell into web dev — HTML/CSS/JS experiments
  ↳  Now obsessed with interactive UIs & browser APIs

<span style="color:#fff">PROJECTS & BUILDS</span>
  <span style="color:#888">2024 – present</span>
  ↳  Built 4+ personal projects from scratch with no tutorials
  ↳  This portfolio — ~600 lines of hand-crafted JS, no frameworks
  ↳  Regular GitHub commits; learning through building

<span style="color:#fff">SKILLS IN PROGRESS</span>
  ↳  React.js &amp; component architecture
  ↳  Backend fundamentals (Node, SQL)
  ↳  DSA — solving problems on LeetCode &amp; Codeforces

<span style="color:#555">Type "projects" to see what I've shipped so far.</span>`,

    contact: () => `<span style="color:#4af626;font-weight:bold">> CONTACT.SH</span>
―――――――――――――――――――――――――――――――――

  Email    → <a href="mailto:rohitkumarsahoo37@gmail.com" class="term-link">rohitkumarsahoo37@gmail.com</a>
  LinkedIn → <a href="https://www.linkedin.com/in/rohit-kumar-sahoo-a68a452b0" class="term-link" target="_blank">linkedin.com/in/rohit-kumar-sahoo</a>
  GitHub   → <a href="https://github.com/RohitKSahoo" class="term-link" target="_blank">github.com/RohitKSahoo</a>

  <span style="color:#555">Flip the ID card (left panel) for quick access to all links.</span>`,

    resume: () => `<span style="color:#4af626;font-weight:bold">> RESUME.PDF</span>
―――――――――――――――――――――――――――――――――

  <a href="./assets/resume.pdf" class="term-link" target="_blank" download>⬇  Download PDF Resume</a>

  Or view quick summary:

  Name      Rohit Kumar Sahoo
  Role      CSE Student · Aspiring Developer
  Location  India
  Email     rohitkumarsahoo37@gmail.com

  Education B.Tech CSE  (2024–2028)
  Skills    C, C++, Python, JavaScript, HTML, CSS, Git

  Projects  Portfolio, Snake Game (WIP), DS Library, Python Tools

<span style="color:#555">PDF will be available once uploaded to the repository.</span>`,

    // ── Easter eggs ──────────────────────────────────────────
    whoami: () => `<span style="color:#4af626">rohit</span> — a human who types too many late-night commits.
uid=1000(rohit) gid=1000(rohit) groups=1000(rohit),4(adm),24(cdrom),27(sudo)`,

    sudo: () => `[sudo] password for rohit: 
<span style="color:#ff4444">Permission denied.</span>  Nice try though. 🙂`,

    ls: () => `<span style="color:#4af626">about.txt</span>   <span style="color:#4af626">projects.log</span>   <span style="color:#4af626">skills.sh</span>   <span style="color:#4af626">experience.log</span>
<span style="color:#4af626">contact.sh</span>  <span style="color:#4af626">resume.pdf</span>     <span style="color:#555">secret/</span>     <span style="color:#555">node_modules/</span>  <span style="color:#ff4444">(don't open)</span>`,

    cat: () => `<span style="color:#888">cat: missing operand.  Try:</span>  cat README.md`,

    "cat readme.md": () => `# Rohit Kumar Sahoo — Portfolio v2

A BIOS-themed, terminal-style developer portfolio.

## Stack
- Vanilla HTML / CSS / JavaScript
- Canvas API (matrix rain)
- CSS 3D transforms (ID card tilt + flip)

## Features
- BIOS boot animation (skippable)
- Draggable split panel
- Fully functional terminal with history &amp; tab-complete
- Clickable 3D ID card

Star the repo if you liked it! ⭐
<a href="https://github.com/RohitKSahoo/Portfolio" class="term-link" target="_blank">github.com/RohitKSahoo/Portfolio</a>`,

    uptime: () => {
        const now = new Date();
        const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        return ` ${now.toLocaleTimeString('en-IN', { hour12: false })}  up ${h}h ${m}m ${s}s,  1 user,  load average: 0.42, 0.18, 0.09`;
    },

    matrix: () => `<span style="color:#4af626">Entering the Matrix...</span>
  "There is no spoon."

  Take the <span style="color:#f44">red pill</span> and stay in Wonderland.
  Take the <span style="color:#4af626">green pill</span> and the story ends.

  You chose the <span style="color:#4af626">green pill</span>. Wise.`,

    "rm -rf /": () => `<span style="color:#ff4444">rm: cannot remove '/': Permission denied</span>
<span style="color:#888">Phew. Crisis averted.</span>`,

    history: null, // handled dynamically below
};

// These are the commands that show in autocomplete
const commandNames = [
    "help", "about", "projects", "skills", "experience",
    "contact", "resume", "clear", "whoami", "sudo", "ls",
    "cat", "uptime", "matrix"
];


/* ============================================================
   WELCOME TYPEWRITER — plays after boot
============================================================ */
function startWelcomeTypewriter() {
    const el = document.getElementById("welcome-type");
    if (!el) return;

    const text = `Welcome! Type <span style="color:#4af626">help</span> to see available commands.`;
    el.innerHTML = "";

    // Parse HTML and type character by character (safely)
    const fullText = `Welcome! Type 'help' to see available commands.`;
    let i = 0;
    function next() {
        if (i < fullText.length) {
            el.textContent += fullText[i];
            i++;
            setTimeout(next, 28);
        } else {
            // Replace plain text with styled version
            el.innerHTML = `Welcome! Type <span style="color:#4af626">help</span> to see available commands. Or click a nav link above.`;
        }
    }
    setTimeout(next, 400);
}


/* ============================================================
   TERMINAL ENGINE
============================================================ */
const cmdInput      = document.getElementById("cmd-input");
const mobileCmdInput = document.getElementById("mobile-cmd-input");
const mobileSendBtn = document.getElementById("mobile-send-btn");
const inputDisplay  = document.getElementById("input-display");
const historyEl     = document.getElementById("history");
const terminalWindow = document.getElementById("terminal-output");

// Command history (↑ / ↓ navigation)
let cmdHistory    = [];
let historyIdx    = -1;

function typeOutput(html, el) {
    return new Promise((resolve) => {
        // Strip HTML tags to get plain text for typing animation
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        const plainText = tmp.textContent || tmp.innerText || "";

        let i = 0;
        // Speed: 12ms per char feels snappy but still visible
        const delay = 12;

        function typeNext() {
            if (i < plainText.length) {
                // Show plain text as we type
                el.textContent = plainText.slice(0, i + 1);
                terminalWindow.scrollTop = terminalWindow.scrollHeight;
                i++;
                setTimeout(typeNext, delay);
            } else {
                // Done typing — swap in the full rich HTML
                el.innerHTML = html;
                terminalWindow.scrollTop = terminalWindow.scrollHeight;
                // Wire up clickable sub-commands
                el.querySelectorAll(".nav-cmd").forEach(span => {
                    span.style.cursor = "pointer";
                    span.style.color  = "#4af626";
                    span.style.textDecoration = "underline";
                    span.addEventListener("click", () => runCommand(span.dataset.cmd));
                });
                resolve();
            }
        }

        typeNext();
    });
}

async function runCommand(raw) {
    const cmd   = raw.trim();
    const clean = cmd.toLowerCase();
    if (!clean) return;

    // Record in history
    if (cmdHistory[0] !== cmd) cmdHistory.unshift(cmd);
    if (cmdHistory.length > 50) cmdHistory.pop();
    historyIdx = -1;

    // Echo input line
    const prompt = document.createElement("div");
    prompt.className = "output-line";
    prompt.innerHTML = `<span class="p-user">rohit</span><span class="p-host">@portfolio</span><span class="p-symbol">:~$</span> <span style="color:#fff">${escapeHtml(cmd)}</span>`;
    historyEl.appendChild(prompt);

    // Clear inputs
    if (cmdInput)      { cmdInput.value = ""; }
    if (inputDisplay)  { inputDisplay.textContent = ""; }
    if (mobileCmdInput){ mobileCmdInput.value = ""; }
    hideAutocomplete();

    // Handle clear
    if (clean === "clear") {
        historyEl.innerHTML = "";
        return;
    }

    // Handle history command
    if (clean === "history") {
        const output = document.createElement("div");
        output.className = "output-line system-output";
        historyEl.appendChild(output);
        if (cmdHistory.length === 0) {
            output.innerHTML = "<span style='color:#555'>No history yet.</span>";
        } else {
            output.innerHTML = cmdHistory.map((c, i) => `  ${String(i + 1).padStart(2, " ")}  ${escapeHtml(c)}`).join("\n");
        }
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
        return;
    }

    const output = document.createElement("div");
    output.className = "output-line system-output";
    historyEl.appendChild(output);

    // Look up command
    const handler = allCommands[clean];
    if (typeof handler === "function") {
        await typeOutput(handler(), output);
    } else if (clean === "clear") {
        historyEl.innerHTML = "";
    } else {
        await typeOutput(
            `<span style="color:#ff6b6b">bash: ${escapeHtml(clean)}: command not found</span>\n` +
            `<span style="color:#555">Type <span style="color:#4af626;cursor:pointer" onclick="runCommand('help')">help</span> to see available commands.</span>`,
            output
        );
    }

    terminalWindow.scrollTop = terminalWindow.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}


/* ============================================================
   TAB AUTOCOMPLETE
============================================================ */
let autocompleteHint = null;

function buildAutocompleteHint() {
    if (autocompleteHint) return;
    autocompleteHint = document.createElement("div");
    autocompleteHint.className = "autocomplete-hint";
    const promptCont = document.querySelector(".prompt-container");
    if (promptCont) {
        promptCont.style.position = "relative";
        promptCont.appendChild(autocompleteHint);
    }
}

function showAutocomplete(matches) {
    buildAutocompleteHint();
    if (!autocompleteHint) return;
    if (matches.length === 0) { hideAutocomplete(); return; }
    autocompleteHint.textContent = matches.join("   ");
    autocompleteHint.classList.add("visible");
}

function hideAutocomplete() {
    if (autocompleteHint) autocompleteHint.classList.remove("visible");
}


/* ============================================================
   KEYBOARD HANDLING — history + tab + enter
============================================================ */
function handleKeydown(e, inputEl) {
    const val = (inputEl ? inputEl.value : "").toLowerCase().trim();

    if (e.key === "Enter") {
        e.preventDefault();
        runCommand(inputEl ? inputEl.value : "");
        return;
    }

    // ↑ — older command
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        historyIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        const v = cmdHistory[historyIdx];
        if (cmdInput)      cmdInput.value = v;
        if (inputDisplay)  inputDisplay.textContent = v;
        if (mobileCmdInput) mobileCmdInput.value = v;
        return;
    }

    // ↓ — newer command
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx <= 0) {
            historyIdx = -1;
            if (cmdInput)      cmdInput.value = "";
            if (inputDisplay)  inputDisplay.textContent = "";
            if (mobileCmdInput) mobileCmdInput.value = "";
            return;
        }
        historyIdx--;
        const v = cmdHistory[historyIdx];
        if (cmdInput)      cmdInput.value = v;
        if (inputDisplay)  inputDisplay.textContent = v;
        if (mobileCmdInput) mobileCmdInput.value = v;
        return;
    }

    // Tab — autocomplete
    if (e.key === "Tab") {
        e.preventDefault();
        if (!val) return;
        const matches = commandNames.filter(c => c.startsWith(val));
        if (matches.length === 1) {
            // complete it
            if (cmdInput)      cmdInput.value = matches[0];
            if (inputDisplay)  inputDisplay.textContent = matches[0];
            hideAutocomplete();
        } else if (matches.length > 1) {
            showAutocomplete(matches);
        }
        return;
    }

    // Normal typing — update autocomplete
    if (e.key.length === 1 || e.key === "Backspace") {
        setTimeout(() => {
            const cur = (inputEl ? inputEl.value : "").toLowerCase().trim();
            if (!cur) { hideAutocomplete(); return; }
            const matches = commandNames.filter(c => c.startsWith(cur));
            if (matches.length > 0 && matches[0] !== cur) showAutocomplete(matches);
            else hideAutocomplete();
        }, 0);
    }
}

// Desktop hidden input events
if (cmdInput) {
    cmdInput.addEventListener("input", () => {
        if (inputDisplay) inputDisplay.textContent = cmdInput.value;
    });
    cmdInput.addEventListener("keydown", (e) => handleKeydown(e, cmdInput));
}

// Mobile visible input events
if (mobileCmdInput) {
    mobileCmdInput.addEventListener("keydown", (e) => handleKeydown(e, mobileCmdInput));
}
if (mobileSendBtn) {
    mobileSendBtn.addEventListener("click", () => {
        runCommand(mobileCmdInput ? mobileCmdInput.value : "");
    });
}

// Auto focus desktop input on click
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) return;
    if (!e.target.closest(".nav-item, .card-3d-container, a")) {
        if (cmdInput) cmdInput.focus();
    }
});

if (window.innerWidth > 768 && cmdInput) {
    cmdInput.focus();
}

// NAV ITEMS
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => runCommand(item.dataset.cmd));
});


/* ============================================================
   FOOTER CLOCK
============================================================ */
(function () {
    const clockEl = document.getElementById("realtime-clock");
    if (!clockEl) return;
    function tick() {
        clockEl.textContent = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            hour12: true
        });
    }
    tick();
    setInterval(tick, 1000);
})();


/* ============================================================
   MOBILE SCROLL — fade ID card when scrolling
============================================================ */
window.addEventListener("scroll", () => {
    if (window.innerWidth > 768) return;
    const threshold = 40;
    if (window.scrollY > threshold) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
}, { passive: true });
