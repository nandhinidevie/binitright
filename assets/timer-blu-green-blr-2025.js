let timeRemaining = 45;
let timerInterval;
let currentIndex = 0;
let isPaused = false;
let startTime;
let tickingAudio = new Audio("assets/ticking.mp3");
let timeUpAudio = new Audio("assets/time-up.mp3");
let correctAnswerAudio = new Audio("assets/correct.mp3");
let celebrationAudio = new Audio("assets/winning.mp3");
let fireworksActive = true;

const images = [
    { src: "https://i.postimg.cc/hvzqbwsW-/ww-plastic-drink.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/vB4syWm4/banana-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/MG5xW1H4/ww-juice-box.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/sxdt7Jnw/ww-wrapper-1-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/25cDgHCp/orange-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/qBCTZXYY/can-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/wxFSs1ck/apple.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/jdHrRqR4/paper-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/VvQww4pV/bin-it-right-10-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/XJbT9Fzs/snack-cover.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/nzNthCs0/pizza-box-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/bJ2P44Cn/bin-it-right-9-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/25yr71n2/bin-it-right-8-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/BnMJFTPj/hard-plastic-cover.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/dtRssPqm/watermelon.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/YCppjn0c/paperbag.png", correctBin: ["ww-blue"] },
];

function playWrongAnswerSound() {
    const audio = new Audio("assets/wrong.mp3");
    audio.play();
}

function startGame() {
    document.getElementById('timer-container').style.display = 'block';
    document.getElementById('progress-tracker').style.display = 'block';
    startTime = Date.now();
    currentIndex = 0;
    timeRemaining = 45;
    isPaused = false;
    updateImage();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('timer-text').innerText = `${timeRemaining}sec`;

            if (timeRemaining === 5) {
                tickingAudio.loop = true;
                tickingAudio.play();
            }

            if (timeRemaining === 0) {
                clearInterval(timerInterval);
                tickingAudio.pause();
                tickingAudio.currentTime = 0;
                timeUpAudio.play();
                showModal("⌛", "Time’s up!", "", true, false);
            }
        }
    }, 1000);
}

async function playTrimmedAudio(url) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0.1);

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function createFirework() {
    if (!fireworksActive) return;

    const firework = document.createElement("div");
    firework.classList.add("firework");
    document.body.appendChild(firework);

    const x = Math.random() * window.innerWidth;
    firework.style.left = `${x}px`;

    setTimeout(() => {
        createExplosion(x);
        firework.remove();
    }, 1500);
}

function createExplosion(x) {
    for (let i = 0; i < 30; i++) {
        const explosion = document.createElement("div");
        explosion.classList.add("explosion");
        explosion.style.left = `${x}px`;
        explosion.style.top = `${window.innerHeight / 3}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        explosion.style.setProperty("--x", `${xOffset}px`);
        explosion.style.setProperty("--y", `${yOffset}px`);
        explosion.style.background = getRandomColor();
        explosion.style.boxShadow = `0 0 10px ${explosion.style.background}`;

        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1500);
    }
}

function getRandomColor() {
    const colors = ["red", "blue", "yellow", "lime", "magenta", "cyan", "white"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function launchFireworks() {
    if (!fireworksActive) return;
    createFirework();
    setTimeout(launchFireworks, Math.random() * 1000 + 500);
}

function updateImage() {
    const imageEl = document.getElementById('waste-image');
    if (currentIndex < images.length) {
        imageEl.src = images[currentIndex].src;
        document.getElementById('progress-tracker').innerText = `${images.length - currentIndex - 1} items left`;
    } else {
        let timeTaken = 45 - timeRemaining;
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        celebrationAudio.play();
        fireworksActive = true;
        launchFireworks();
        setTimeout(() => fireworksActive = false, 5000);
        showModal("🎉", `Well done! You sorted the waste in ${timeTaken} secs.`, 
            `If ${timeTaken} seconds is all it takes, why not do it every day? If you don’t, your unsorted waste spends 500 years polluting our air, water, and land.`, false, true);
    }
}

function showModal(icon, title, body, showTryAgain, showPlayAgain) {
    clearInterval(timerInterval);
    isPaused = true;
    document.getElementById('result-message-1').innerText = icon;
    document.getElementById('result-title').innerText = title;
    document.getElementById('result-body').innerText = body;
    document.getElementById('try-again-btn').style.display = showTryAgain ? 'block' : 'none';
    document.getElementById('play-again-btn').style.display = showPlayAgain ? 'block' : 'none';
    document.getElementById('share-game-btn').style.display = showPlayAgain ? 'block' : 'none';
    document.getElementById('result-modal').style.display = 'block';
}

function shakeImage() {
    const image = document.getElementById('waste-image');
    image.classList.add('shake');
    setTimeout(() => image.classList.remove('shake'), 500);
}

document.querySelectorAll('.bin').forEach(bin => {
    bin.addEventListener('click', function () {
        if (!isPaused) {
            const correctBins = images[currentIndex].correctBin;
            if (correctBins.includes(this.id)) {
                currentIndex++;
                playTrimmedAudio('assets/correct-ans.mp3');
                updateImage();
            } else {
                playWrongAnswerSound();
                showModal("👎", "Oops!", "That doesn’t go there.", true, false);
            }
        }
    });
});


// Buttons
document.getElementById('try-again-btn').addEventListener('click', () => {
    if (timeRemaining <= 0) {
        window.location.href = "/wework/";
    } else {
        document.getElementById('result-modal').style.display = 'none';
        isPaused = false;
        startTimer();
    }
});

document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('result-modal').style.display = 'none';
    document.getElementById('celebration').style.display = 'none';
    celebrationAudio.pause();
    celebrationAudio.currentTime = 0;
    fireworksActive = false;
    startGame();
});

document.getElementById('share-game-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        let copyMessage = document.getElementById('copy-message');
        copyMessage.style.display = 'block';
        setTimeout(() => copyMessage.style.display = 'none', 5000);
    });
});

window.onload = startGame;
