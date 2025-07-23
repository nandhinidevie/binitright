let timeRemaining = 45;
let timerInterval;
let currentIndex = 0;
let isPaused = false;
let startTime;
let tickingAudio = new Audio("assets/ticking.mp3");
let timeUpAudio = new Audio("assets/time-up.mp3");
let correctAnswerAudio = new Audio("assets/correct.mp3");
let celebrationAudio = new Audio("assets/winning.mp3");
let correctAnswerTrimmedAudio = new Audio("assets/correct-ans.mp3");
let fireworksActive = true;



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
        levelUpText: (timeTaken) => `${timeTaken} सेकंदात पातळी 1 पूर्ण केली. अजून कचरा वेगळा करूया.`,
        levelUpButton: "पातळी 2",
    },
    en: {
        timeLeft: "Time left",
        itemsLeft: "Items left",
        timeUp: "Time’s up!",
        timeUpBody: "",
        oops: "Oops!",
        oopsBody: "That doesn’t go there.",
        wellDone: "Well done!",
        wellDoneBody: (timeTaken) => `You completed level 1 in ${timeTaken} secs. If ${timeTaken} seconds is all it takes, why not do it every day? If you don't, your unsorted waste spends 500 years polluting our air, water, and land.`,
        tryAgain: "Try Again",
        playAgain: "Play Again",
        share: "Share Game",
        dry: "Dry",
        wet: "Wet",
        reject: "Reject",
        levelUpText: (timeTaken) => `You completed level 1 in ${timeTaken} seconds. Let's sort more.`,
        levelUpButton: "Start Level 2",
    }
};

function updateLanguageTexts() {
    document.getElementById('timer-text').innerText = `${timeRemaining} sec`;
    document.getElementById('progress-tracker').innerText = `${Math.max(images.length - currentIndex - 1, 0)} ${languages[currentLanguage].itemsLeft}`;
    document.getElementById('try-again-btn').innerText = languages[currentLanguage].tryAgain;
    document.getElementById('play-again-btn').innerText = languages[currentLanguage].playAgain;
    document.getElementById('share-game-btn').innerText = languages[currentLanguage].share;
    document.getElementById('wet-waste').innerText = languages[currentLanguage].wet;
    document.getElementById('dry-waste').innerText = languages[currentLanguage].dry;
    document.getElementById('reject-waste').innerText = languages[currentLanguage].reject;
    document.getElementById('image-name').innerText = images[currentIndex].name[currentLanguage];

    const levelUpBtnEl = document.getElementById('level-up-btn');
    if (!document.getElementById('level-up-modal').classList.contains('hidden')) {
        document.getElementById('level-up-message').innerText = languages[currentLanguage].levelUpText(timeTaken);
        document.getElementById('level-up-btn').innerText = languages[currentLanguage].levelUpButton;
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
    updateLanguageTexts();
}

const images = [ 
    { src: "https://i.postimg.cc/vmM2QPc9/apple.png", correctBin: ["ww-green"], name: { mr: "सफरचंद", en: "Apple" } },
    { src: "https://i.postimg.cc/jjXgCz71/banana.png", correctBin: ["ww-green"], name: { mr: "केळी", en: "Banana" } },
    { src: "https://i.postimg.cc/4yKB8qSC/broken-glass.png", correctBin: ["ww-grey"], name: { mr: "तुटलेली काच", en: "Broken Glass" } },
    { src: "https://i.postimg.cc/gkZg39h8/cardboard.png", correctBin: ["ww-blue"], name: { mr: "पुठ्ठा", en: "Cardboard" } },
    { src: "https://i.postimg.cc/zf07qqmZ/cotton.png", correctBin: ["ww-green"], name: { mr: "कापूस", en: "Cotton" } },
    { src: "https://i.postimg.cc/jjsvVLF4/diaper.png", correctBin: ["ww-grey"], name: { mr: "डायपर", en: "Diaper" } },
    { src: "https://i.postimg.cc/DZ0gZRFW/dried-leaves-1.png", correctBin: ["ww-green"], name: { mr: "वाळलेली पाने", en: "Dried Leaves" } },
    { src: "https://i.postimg.cc/fywMm720/dust-1.png", correctBin: ["ww-grey"], name: { mr: "धूळ", en: "Dust" } },
    { src: "https://i.postimg.cc/0QG8zXfs/eggshell.png", correctBin: ["ww-green"], name: { mr: "अंड्याचे कवच", en: "Eggshell" } },
    { src: "https://i.postimg.cc/LXSSFBM0/glass-bottle.png", correctBin: ["ww-blue"], name: { mr: "काचेची बाटली", en: "Glass Bottle" } },
    { src: "https://i.postimg.cc/PxMjXpXf/glass-jar.png", correctBin: ["ww-blue"], name: { mr: "काचेचे भांडे", en: "Glass Jar" } },
    { src: "https://i.postimg.cc/jd2bTSGK/hair.png", correctBin: ["ww-grey"], name: { mr: "केस", en: "Hair" } },
    { src: "https://i.postimg.cc/WpXvxkYX/nail.png", correctBin: ["ww-grey"], name: { mr: "नखे", en: "Nail" } },
    { src: "https://i.postimg.cc/qvCHtZJ5/old-cloth.png", correctBin: ["ww-blue"], name: { mr: "जुने कापड", en: "Old Cloth" } },
    { src: "https://i.postimg.cc/pdfNChnQ/onion.png", correctBin: ["ww-green"], name: { mr: "कांदा", en: "Onion" } },
    { src: "https://i.postimg.cc/ZRHGkGHC/orange.png", correctBin: ["ww-green"], name: { mr: "संत्र", en: "Orange" } },
    { src: "https://i.postimg.cc/dQWb5KDf/plastic-cover.png", correctBin: ["ww-blue"], name: { mr: "प्लास्टिक कव्हर", en: "Plastic Cover" } },
    { src: "https://i.postimg.cc/5tMTX4kX/sanitary-napkin.png", correctBin: ["ww-grey"], name: { mr: "सॅनिटरी नॅपकिन", en: "Sanitary Napkin" } },
    { src: "https://i.postimg.cc/0jrHTbrB/thermacol.png", correctBin: ["ww-blue"], name: { mr: "थर्माकोल", en: "Thermacol" } },
    { src: "https://i.postimg.cc/652mz2k7/watermelon.png", correctBin: ["ww-green"], name: { mr: "टरबूज", en: "Watermelon" } },
    { src: "https://i.postimg.cc/dVGScMtw/white-paper.png", correctBin: ["ww-blue"], name: { mr: "टिशू पेपर", en: "White Paper" } },
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

function playTrimmedAudio() {
    correctAnswerTrimmedAudio.currentTime = 0;
    correctAnswerTrimmedAudio.play();
}

function createFirework() { /* unchanged */ }
function createExplosion(x) { /* unchanged */ }
function getRandomColor() { /* unchanged */ }
function launchFireworks() { /* unchanged */ }

function updateImage() {
    const imageEl = document.getElementById('waste-image');
    if (currentIndex < images.length) {
        imageEl.src = images[currentIndex].src;
        document.getElementById('image-name').innerText = images[currentIndex].name[currentLanguage];
        imageEl.setAttribute('draggable', true);
        imageEl.ondragstart = function (event) {
            event.dataTransfer.setData("text/plain", currentIndex);
        };
        document.getElementById('progress-tracker').innerText = `${Math.max(images.length - currentIndex - 1, 0)} ${languages[currentLanguage].itemsLeft}`;
    } else {
        let timeTaken = 45 - timeRemaining;
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        celebrationAudio.play();
        fireworksActive = true;
        launchFireworks();
        setTimeout(() => fireworksActive = false, 5000);

        showModal("🎉", languages[currentLanguage].wellDone, languages[currentLanguage].levelUpText(timeTaken), false, false);

        document.getElementById('try-again-btn').style.display = 'none';
        document.getElementById('play-again-btn').style.display = 'none';
        document.getElementById('share-game-btn').style.display = 'none';
        document.getElementById('level-up-btn').style.display = 'block';
        document.getElementById('level-up-message').style.display = 'block';
        showLevelUpModal();
        updateLanguageTexts();
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
    document.getElementById('level-up-btn').style.display = 'none';
    document.getElementById('level-up-message').style.display = 'none';
}

function shakeImage() { /* unchanged */ }

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

// Mobile Drag Support (unchanged)

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



function showLevelUpModal() {
    clearInterval(timerInterval);
    isPaused = true;

    const levelUpModal = document.getElementById('level-up-modal');
    const levelUpMessage = document.getElementById('level-up-message');

    // levelUpMessage.innerText = languages[currentLanguage].levelUpText;
    document.getElementById('level-up-btn').innerText = languages[currentLanguage].levelUpButton;

    levelUpModal.style.display = 'block';
}

// Level Up Button Handler ✅
document.getElementById('level-up-btn').addEventListener('click', () => {
    window.location.href = "alibaug/level-2/"; // Replace with your actual Level 2 URL
});

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
