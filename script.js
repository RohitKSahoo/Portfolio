'use strict';

/* ============================================================
   BIOS-STYLE BOOT SEQUENCE
============================================================ */
(function () {
    const bootScreen = document.getElementById("boot-screen");
    const bootText = document.getElementById("boot-text");
    const progressBar = document.getElementById("boot-progress-bar");
    const body = document.body;

    // Ensure all UI stays hidden until boot ends
    body.classList.add("booting");

    if (!bootScreen || !bootText) {
        body.classList.remove("booting");
        body.classList.add("boot-complete");
        return;
    }

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

    let index = 0;

    function typeLine() {
        if (index >= lines.length) {
            finishBoot();
            return;
        }

        const line = lines[index];
        let charIndex = 0;

        function typeChar() {
            if (charIndex < line.length) {
                bootText.textContent += line[charIndex];
                charIndex++;
                setTimeout(typeChar, 5);
            } else {
                bootText.textContent += "\n";
                index++;

                const progress = Math.round((index / lines.length) * 100);
                if (progressBar) progressBar.style.width = progress + "%";

                setTimeout(typeLine, line.trim() === "" ? 40 : 80);
            }
        }
        typeChar();
    }

    function finishBoot() {
        setTimeout(() => {
            bootScreen.classList.add("fade-out");

            bootScreen.addEventListener("animationend", () => {
                bootScreen.remove();
                body.classList.remove("booting");
                body.classList.add("boot-complete");
            });

        }, 300);
    }

    window.addEventListener("load", () => typeLine());
})();

/* ============================================================
   MATRIX BACKGROUND
============================================================ */
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*".split("");
let fontSize = 16;
let columns, drops;

function resizeMatrix() {
    const panel = document.querySelector(".visual-panel");
    if (!panel) return;
    canvas.width = panel.clientWidth;
    canvas.height = panel.clientHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
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
const dragBar = document.getElementById("drag-bar");
const visualPanel = document.querySelector(".visual-panel");
const terminalPanel = document.querySelector(".terminal-panel");
const mainEl = document.querySelector("main");

if (dragBar && visualPanel && terminalPanel && mainEl) {
    let dragging = false;

    dragBar.addEventListener("mousedown", (e) => {
        dragging = true;
        document.body.style.userSelect = "none";
    });

    window.addEventListener("mouseup", () => {
        dragging = false;
        document.body.style.userSelect = "";
    });

    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        const rect = mainEl.getBoundingClientRect();
        let newWidth = e.clientX - rect.left;

        const minWidth = 260;
        const maxWidth = rect.width * 0.75;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        visualPanel.style.width = newWidth + "px";

        resizeMatrix();
    });
}

/* ============================================================
   3D CARD TILT + FLIP
============================================================ */
const cardContainer = document.getElementById("card-3d-container");
const card = document.getElementById("card-3d");
const light = document.getElementById("light");

let flipped = false;

if (cardContainer && card && light) {
    cardContainer.addEventListener("mousemove", (e) => {
        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = ((y - centerY) / centerY) * -18;
        const rotY = ((x - centerX) / centerX) * 18;

        card.style.transform = `rotateX(${rotX}deg) rotateY(${flipped ? rotY + 180 : rotY}deg)`;

        light.style.transform = `translate(${(x / rect.width) * 100}%, ${(y / rect.height) * 100}%)`;
    });

    cardContainer.addEventListener("mouseleave", () => {
        card.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
    });

    cardContainer.addEventListener("click", () => {
        flipped = !flipped;
        card.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
    });
}

/* ============================================================
   TERMINAL TYPING
============================================================ */
const cmdInput = document.getElementById("cmd-input");
const inputDisplay = document.getElementById("input-display");
const historyEl = document.getElementById("history");
const terminalWindow = document.getElementById("terminal-output");

const commands = {
    help: `Available commands:
  about       - Learn about me
  projects    - View my projects
  skills      - My technical skills
  experience  - My experience
  contact     - Contact details
  clear       - Clear the terminal`,

    about: `Hi, I'm Rohit Kumar Sahoo — a CSE student constantly exploring and learning whatever sparks my curiosity.`,

    projects: `Some things I've worked on:
- Portfolio v2 (this site)
- Practice projects in C, C++, Python, and JavaScript
- Experiments with web UIs, terminals, and animations`,

    skills: `[Languages] C, C++, Python, JavaScript
[Web] HTML, CSS, JavaScript
[Tools] Git, GitHub, VS Code
[Exploring] React, backend basics, 3D on the web`,

    experience: `Currently a CSE student, focusing on:
> Problem solving
> Understanding core CS concepts
> Building interactive web experiments like this portfolio`,

    contact: `You can reach me at:
Email:    rohitkumarsahoo37@gmail.com
LinkedIn: www.linkedin.com/in/rohit-kumar-sahoo-a68a452b0
GitHub:   github.com/RohitKSahoo`
};

function typeOutput(text, el) {
    return new Promise(async (resolve) => {
        for (let i = 0; i < text.length; i++) {
            el.innerHTML += text[i] === "\n" ? "<br>" : text[i];
            terminalWindow.scrollTop = terminalWindow.scrollHeight;
            await new Promise(res => setTimeout(res, 8));
        }
        resolve();
    });
}

async function runCommand(cmd) {
    const clean = cmd.trim().toLowerCase();
    if (!clean) return;

    const prompt = document.createElement("div");
    prompt.className = "output-line";
    prompt.innerHTML =
        `<span class="p-user">rohit</span><span class="p-host">@portfolio</span><span class="p-symbol">:~$</span> <span class="user-text">${cmd}</span>`;
    historyEl.appendChild(prompt);

    cmdInput.value = "";
    inputDisplay.textContent = "";

    if (clean === "clear") {
        historyEl.innerHTML = "";
        return;
    }

    const output = document.createElement("div");
    output.className = "output-line system-output";
    historyEl.appendChild(output);

    if (commands[clean]) {
        await typeOutput(commands[clean], output);
    } else {
        await typeOutput(`Command not found: ${clean}`, output);
    }

    terminalWindow.scrollTop = terminalWindow.scrollHeight;
}

cmdInput.addEventListener("input", () => {
    inputDisplay.textContent = cmdInput.value;
});

cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runCommand(cmdInput.value);
});

document.addEventListener("click", (e) => {
    if (!e.target.closest('.nav-item')) cmdInput.focus();
});

document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => runCommand(item.dataset.cmd));
});

/* ============================================================
   CLOCK
============================================================ */
(function () {
    const clockEl = document.getElementById("realtime-clock");
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
})();
