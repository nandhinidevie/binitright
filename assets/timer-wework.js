let timeRemaining = 60;
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
    { src: "https://i.postimg.cc/g095P8mG/wework-sugar.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/hvzqbwsW-/ww-plastic-drink.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/vmbbF0Yf/ww-paper-plate.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/Xqv1ggck/ww-stirrer.png", correctBin: ["ww-blue", "ww-green"] },
    { src: "https://i.postimg.cc/DZzhmmbz/ww-paper-box.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/MG5xW1H4/ww-juice-box.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/mD6s9RQy/ww-foil.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/4y6j5hqZ/ww-soiled-paper-plate-1-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/sxdt7Jnw/ww-wrapper-1-1.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/25cDgHCp/orange-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/j5tFDTD9/ww-paper-bag-2.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/qBCTZXYY/can-1.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/wxFSs1ck/apple.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/jdHrRqR4/paper-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/Fs54tkXK/cover-1.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/XJbT9Fzs/snack-cover.png", correctBin: ["ww-red"] },
    { src: "https://i.postimg.cc/nzNthCs0/pizza-box-1.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/vB4syWm4/banana-1.png", correctBin: ["ww-green"] },
    { src: "https://i.postimg.cc/RFdbfYf0/ww-plate.png", correctBin: ["ww-blue"] },
    { src: "https://i.postimg.cc/xT1VsvT7/hard-teabag.png", correctBin: ["ww-green"] }
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
    timeRemaining = 60;
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
        imageEl.setAttribute('draggable', true);
        imageEl.ondragstart = function (event) {
            event.dataTransfer.setData("text/plain", currentIndex);
        };
        document.getElementById('progress-tracker').innerText = `${images.length - currentIndex - 1} items left`;
    } else {
        let timeTaken = 60 - timeRemaining;
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        celebrationAudio.play();
        fireworksActive = true;
        launchFireworks();
        setTimeout(() => fireworksActive = false, 5000);
        showModal("🎉", `Well done! You sorted the waste in ${timeTaken} secs.`, 
            `If ${timeTaken} seconds is all it takes, why not do it every day at WeWork too?`, false, true);
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

    bin.addEventListener('dragover', event => event.preventDefault());

    bin.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!isPaused) {
            const correctBins = images[currentIndex].correctBin;
            if (correctBins.includes(this.id)) {
                currentIndex++;
                playTrimmedAudio('assets/correct-ans.mp3');
                updateImage();
            } else {
                shakeImage();
                playWrongAnswerSound();
                showModal("👎", "Oops!", "That doesn’t go there.", true, false);
            }
        }
    });
});

// 🎯 MOBILE DRAG SUPPORT (Touch events)
let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const imageEl = document.getElementById('waste-image');

imageEl.addEventListener('touchstart', (e) => {
    if (isPaused) return;
    const touch = e.touches[0];
    draggedElement = imageEl;
    const rect = imageEl.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    
    imageEl.style.position = 'fixed';
    imageEl.style.zIndex = '1000';
    imageEl.style.pointerEvents = 'none'; // Prevent other touch interactions during drag
}, { passive: false });

imageEl.addEventListener('touchmove', (e) => {
    if (!draggedElement) return;
    e.preventDefault();
    const touch = e.touches[0];
    const left = touch.clientX - touchOffsetX;
    const top = touch.clientY - touchOffsetY;

    imageEl.style.left = `${left}px`;
    imageEl.style.top = `${top}px`;
}, { passive: false });

imageEl.addEventListener('touchend', (e) => {
    if (!draggedElement) return;
    
    const bins = document.querySelectorAll('.bin');
    const imageRect = imageEl.getBoundingClientRect();
    let droppedOnBin = false;

    bins.forEach(bin => {
        const binRect = bin.getBoundingClientRect();

        // Check overlap
        const overlap = !(
            binRect.right < imageRect.left ||
            binRect.left > imageRect.right ||
            binRect.bottom < imageRect.top ||
            binRect.top > imageRect.bottom
        );

        if (overlap && !droppedOnBin) {
            droppedOnBin = true;
            const correctBins = images[currentIndex].correctBin;
            if (correctBins.includes(bin.id)) {
                currentIndex++;
                playTrimmedAudio('assets/correct-ans.mp3');
                resetImagePosition();
                updateImage();
            } else {
                shakeImage();
                playWrongAnswerSound();
                showModal("👎", "Oops!", "That doesn’t go there.", true, false);
                resetImagePosition();
            }
        }
    });

    if (!droppedOnBin) {
        resetImagePosition();
    }

    draggedElement = null;
}, { passive: false });

function resetImagePosition() {
    imageEl.style.position = '';
    imageEl.style.left = '';
    imageEl.style.top = '';
    imageEl.style.zIndex = '';
    imageEl.style.pointerEvents = '';
}

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


