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

// Language Setup
let currentLanguage = 'mr'; // Default: Marathi

const languages = {
    mr: {
        timeLeft: "शिल्लक वेळ",
        itemsLeft: "उरलेली वस्तू",
        timeUp: "वेळ संपला!",
        timeUpBody: "",
        oops: "अरे!",
        oopsBody: "हे तिथे जाणार नाही.",
        wellDone: "छान केलं!",
        wellDoneBody: (timeTaken) => `${timeTaken} सेकंदात कचरा योग्य प्रकारे वेगळा केलात. दररोज हे करायला किती वेळ लागतो? जर आपण दररोज हे केले नाही, तर आपला कचरा 500 वर्षे पर्यावरणात राहतो.`,
        tryAgain: "पुन्हा प्रयत्न करा",
        playAgain: "पुन्हा खेळा",
        share: "खेळ शेअर करा",
        dry: "सुका",
        wet: "ओला",
        reject: "खतरनाक",
    },
    en: {
        timeLeft: "Time left",
        itemsLeft: "Items left",
        timeUp: "Time’s up!",
        timeUpBody: "",
        oops: "Oops!",
        oopsBody: "That doesn’t go there.",
        wellDone: "Well done!",
        wellDoneBody: (timeTaken) => `You sorted the waste in ${timeTaken} secs. If ${timeTaken} seconds is all it takes, why not do it every day? If you don't, your unsorted waste spends 500 years polluting our air, water, and land.`,
        tryAgain: "Try Again",
        playAgain: "Play Again",
        share: "Share Game",
        dry: "Dry",
        wet: "Wet",
        reject: "Reject"
    }
};

function updateLanguageTexts() {
    document.getElementById('timer-text').innerText = `${timeRemaining} sec`;
    document.getElementById('progress-tracker').innerText = `${images.length - currentIndex - 1} ${languages[currentLanguage].itemsLeft}`;
    document.getElementById('try-again-btn').innerText = languages[currentLanguage].tryAgain;
    document.getElementById('play-again-btn').innerText = languages[currentLanguage].playAgain;
    document.getElementById('share-game-btn').innerText = languages[currentLanguage].share;
    document.getElementById('wet-waste').innerText = languages[currentLanguage].wet;
    document.getElementById('dry-waste').innerText = languages[currentLanguage].dry;
    document.getElementById('reject-waste').innerText = languages[currentLanguage].reject;
    document.getElementById('image-name').innerText = images[currentIndex].name[currentLanguage];
}

function switchLanguage(lang) {
    currentLanguage = lang;
    updateLanguageTexts();
}

const images = [
    { src: "https://i.postimg.cc/vmM2QPc9/apple.png", correctBin: ["ww-green"], name: { mr: "सफरचंद", en: "Apple" } },
    { src: "https://i.postimg.cc/jjXgCz71/banana.png", correctBin: ["ww-green"], name: { mr: "केळी", en: "Banana" } },
    { src: "https://i.postimg.cc/26907rTF/broken-ceramic.png", correctBin: ["ww-grey"], name: { mr: "तुटलेली सिरेमिक", en: "Broken Ceramic" } },
    { src: "https://i.postimg.cc/4yKB8qSC/broken-glass.png", correctBin: ["ww-grey", "ww-green"], name: { mr: "तुटलेली काच", en: "Broken Glass" } },
    { src: "https://i.postimg.cc/rsvg7jBD/broken-terracotta.png", correctBin: ["ww-grey"], name: { mr: "तुटलेली टेराकोटा", en: "Broken Terracotta" } },
    { src: "https://i.postimg.cc/gkZg39h8/cardboard.png", correctBin: ["ww-blue"], name: { mr: "पुठ्ठा", en: "Cardboard" } },
    { src: "https://i.postimg.cc/y65fJ6D7/chicken-bone.png", correctBin: ["ww-green"], name: { mr: "चिकन हाड", en: "Chicken Bone" } },
    { src: "https://i.postimg.cc/BnfMgh5y/chocolate-cover.png", correctBin: ["ww-blue"], name: { mr: "चॉकलेट कव्हर", en: "Chocolate Cover" } },
    { src: "https://i.postimg.cc/YCN8y1bS/coconut-shell.png", correctBin: ["ww-blue"], name: { mr: "नारळाचे कवच", en: "Coconut Shell" } },
    { src: "https://i.postimg.cc/zf07qqmZ/cotton.png", correctBin: ["ww-green"], name: { mr: "कापूस", en: "Cotton" } },
    { src: "https://i.postimg.cc/jjsvVLF4/diaper.png", correctBin: ["ww-grey"], name: { mr: "डायपर", en: "Diaper" } },
    { src: "https://i.postimg.cc/DZ0gZRFW/dried-leaves-1.png", correctBin: ["ww-green"], name: { mr: "वाळलेली पाने", en: "Dried Leaves" } },
    { src: "https://i.postimg.cc/fywMm720/dust-1.png", correctBin: ["ww-green"], name: { mr: "धूळ", en: "Dust" } },
    { src: "https://i.postimg.cc/0QG8zXfs/eggshell.png", correctBin: ["ww-green"], name: { mr: "अंड्याचे कवच", en: "Eggshell" } },
    { src: "https://i.postimg.cc/RVZM0RJk/empty-medicine.png", correctBin: ["ww-grey"], name: { mr: "रिक्त औषध", en: "Empty Medicine" } },
    { src: "https://i.postimg.cc/bNVqStQs/fish-bone.png", correctBin: ["ww-green"], name: { mr: "माशाचे हाड", en: "Fish Bone" } },
    { src: "https://i.postimg.cc/NjWYpvCt/food-waste-1.png", correctBin: ["ww-green"], name: { mr: "अन्न कचरा", en: "Food Waste" } },
    { src: "https://i.postimg.cc/Mpcq7pDt/garland.png", correctBin: ["ww-green"], name: { mr: "हार घालणे", en: "Garland" } },
    { src: "https://i.postimg.cc/LXSSFBM0/glass-bottle.png", correctBin: ["ww-blue"], name: { mr: "काचेची बाटली", en: "Glass Bottle" } },
    { src: "https://i.postimg.cc/PxMjXpXf/glass-jar.png", correctBin: ["ww-blue"], name: { mr: "काचेचे भांडे", en: "Glass Jar" } },
    { src: "https://i.postimg.cc/jd2bTSGK/hair.png", correctBin: ["ww-grey"], name: { mr: "केस", en: "Hair" } },
    { src: "https://i.postimg.cc/1X5ZfmXG/medical-waste.png", correctBin: ["ww-grey"], name: { mr: "वैद्यकीय कचरा", en: "Medical Waste" } },
    { src: "https://i.postimg.cc/WpXvxkYX/nail.png", correctBin: ["ww-grey"], name: { mr: "नखे", en: "Nail" } },
    { src: "https://i.postimg.cc/Y0nBF5LJ/needle.png", correctBin: ["ww-grey"], name: { mr: "सुई", en: "Needle" } },
    { src: "https://i.postimg.cc/qvCHtZJ5/old-cloth.png", correctBin: ["ww-blue"], name: { mr: "जुने कापड", en: "Old Cloth" } },
    { src: "https://i.postimg.cc/GpwwvJ9h/old-jeans.png", correctBin: ["ww-blue"], name: { mr: "जुनी जीन्स", en: "Old Jeans" } },
    { src: "https://i.postimg.cc/pdfNChnQ/onion.png", correctBin: ["ww-green"], name: { mr: "कांदा", en: "Onion" } },
    { src: "https://i.postimg.cc/ZRHGkGHC/orange.png", correctBin: ["ww-green"], name: { mr: "ऑरेंज", en: "Orange" } },
    { src: "https://i.postimg.cc/fyb6M8q5/plastic-bottle.png", correctBin: ["ww-blue"], name: { mr: "प्लास्टिक बाटली", en: "Plastic Bottle" } },
    { src: "https://i.postimg.cc/dQWb5KDf/plastic-cover.png", correctBin: ["ww-blue"], name: { mr: "प्लास्टिक कव्हर", en: "Plastic Cover" } },
    { src: "https://i.postimg.cc/j2kB2yGT/razor.png", correctBin: ["ww-grey"], name: { mr: "रेझर", en: "Razor" } },
    { src: "https://i.postimg.cc/ncC65wDh/rotten-tomato.png", correctBin: ["ww-green"], name: { mr: "कुजलेले टोमॅटो", en: "Rotten Tomato" } },
    { src: "https://i.postimg.cc/ZK21hF8F/rubber-band.png", correctBin: ["ww-blue"], name: { mr: "रबर बँड", en: "Rubber Band" } },
    { src: "https://i.postimg.cc/6pZF62zs/rusted-nuts.png", correctBin: ["ww-blue"], name: { mr: "गंजलेले काजू", en: "Rusted Nuts" } },
    { src: "https://i.postimg.cc/5tMTX4kX/sanitary-napkin.png", correctBin: ["ww-grey"], name: { mr: "सॅनिटरी नॅपकिन", en: "Sanitary Napkin" } },
    { src: "https://i.postimg.cc/PqzcZgB2/stale-bread.png", correctBin: ["ww-green"], name: { mr: "शिळी ब्रेड", en: "Stale Bread" } },
    { src: "https://i.postimg.cc/9MmkBx2V/takeaway-styro.png", correctBin: ["ww-blue"], name: { mr: "टेकअवे स्टायरो", en: "Takeaway Styro" } },
    { src: "https://i.postimg.cc/ZRwMsrYN/tea-waste.png", correctBin: ["ww-green"], name: { mr: "चहाचा अपव्यय", en: "Tea Waste" } },
    { src: "https://i.postimg.cc/0jrHTbrB/thermacol.png", correctBin: ["ww-blue"], name: { mr: "थर्माकोल", en: "Thermacol" } },
    { src: "https://i.postimg.cc/gj5BmmZk/tin.png", correctBin: ["ww-blue"], name: { mr: "कथील", en: "Tin" } },
    { src: "https://i.postimg.cc/BQrwzZ3m/vegetable-waste.png", correctBin: ["ww-green"], name: { mr: "भाजीपाला कचरा", en: "Vegetable Waste" } },
    { src: "https://i.postimg.cc/652mz2k7/watermelon.png", correctBin: ["ww-green"], name: { mr: "टरबूज", en: "Watermelon" } },
    { src: "https://i.postimg.cc/dVGScMtw/white-paper.png", correctBin: ["ww-blue"], name: { mr: "श्वेतपत्रिका", en: "White Paper" } },
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
    updateLanguageTexts();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('timer-text').innerText = `${timeRemaining} sec`;

            if (timeRemaining === 5) {
                tickingAudio.loop = true;
                tickingAudio.play();
            }

            if (timeRemaining === 0) {
                clearInterval(timerInterval);
                tickingAudio.pause();
                tickingAudio.currentTime = 0;
                timeUpAudio.play();
                showModal("⌛", languages[currentLanguage].timeUp, languages[currentLanguage].timeUpBody, true, false);
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
        document.getElementById('image-name').innerText = images[currentIndex].name[currentLanguage];
        imageEl.setAttribute('draggable', true);
        imageEl.ondragstart = function (event) {
            event.dataTransfer.setData("text/plain", currentIndex);
        };
        document.getElementById('progress-tracker').innerText = `${images.length - currentIndex - 1} ${languages[currentLanguage].itemsLeft}`;
    } else {
        let timeTaken = 60 - timeRemaining;
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        celebrationAudio.play();
        fireworksActive = true;
        launchFireworks();
        setTimeout(() => fireworksActive = false, 5000);
        showModal("🎉", languages[currentLanguage].wellDone, languages[currentLanguage].wellDoneBody(timeTaken), false, true);
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
    updateLanguageTexts();
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
                showModal("👎", languages[currentLanguage].oops, languages[currentLanguage].oopsBody, true, false);
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
                showModal("👎", languages[currentLanguage].oops, languages[currentLanguage].oopsBody, true, false);
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
    imageEl.style.pointerEvents = 'none';
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
                showModal("👎", languages[currentLanguage].oops, languages[currentLanguage].oopsBody, true, false);
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
        window.location.href = "/alibaug/";
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

// Language Switcher (DIV)
document.getElementById('lang-marathi').addEventListener('click', () => {
    switchLanguage('mr');
    setActiveLanguage('lang-marathi');
});

document.getElementById('lang-english').addEventListener('click', () => {
    switchLanguage('en');
    setActiveLanguage('lang-english');
});

function setActiveLanguage(activeId) {
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
}

window.onload = startGame;
