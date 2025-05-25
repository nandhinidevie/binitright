let timeRemaining;
let timerInterval;
let tickingAudio = new Audio("assets/ticking.mp3"); // Timer ticking sound
let timeUpAudio = new Audio("assets/time-up.mp3"); // Time's up sound
let correctAnswerAudio = new Audio("assets/correct.mp3"); // Correct answer sound
let celebrationAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/4383"); // Celebration sound 🎉

function playWrongAnswerSound() {
    const audio = new Audio("assets/wrong.mp3");
    audio.play();
}


const images = [
    { src: "https://i.postimg.cc/vB4syWm4/banana-1.png", correctBin: "green-bin" },
    { src: "https://i.postimg.cc/CLkwdHsD/battery-1.png", correctBin: "black-bin" },
    { src: "https://i.postimg.cc/jSRY2V50/bottle-1.png", correctBin: "blue-bin" },
    { src: "https://i.postimg.cc/2jPzzXhr/bulb-1.png", correctBin: "black-bin" },
    { src: "https://i.postimg.cc/qBCTZXYY/can-1.png", correctBin: "blue-bin" },
    { src: "https://i.postimg.cc/Fs54tkXK/cover-1.png", correctBin: "blue-bin" },
    { src: "https://i.postimg.cc/C5DpBSkY/glass-1.png", correctBin: "blue-bin" },
    { src: "https://i.postimg.cc/7ZNDnHcZ/onion-1.png", correctBin: "green-bin" },
    { src: "https://i.postimg.cc/25cDgHCp/orange-1.png", correctBin: "green-bin" },
    { src: "https://i.postimg.cc/jdHrRqR4/paper-1.png", correctBin: "blue-bin" },
    { src: "https://i.postimg.cc/2SYrWb0t/phone-1.png", correctBin: "black-bin" },
    { src: "https://i.postimg.cc/BvQ3YW9c/egg-1.png", correctBin: "green-bin" },
    { src: "https://i.postimg.cc/nzNthCs0/pizza-box-1.png", correctBin: "blue-bin" }
];

let currentIndex = localStorage.getItem("lastPlayedIndex") ? parseInt(localStorage.getItem("lastPlayedIndex")) : 0;

function updateImage() {
    if (currentIndex >= images.length) currentIndex = 0;
    document.getElementById("waste-image").src = images[currentIndex].src;
}

function startTimer() {
    timeRemaining = 5;
    document.getElementById("timer-container").style.display = "flex";
    document.getElementById("timer-text").innerText = `${timeRemaining} sec`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer-text").innerText = `${timeRemaining} sec`;

        if (timeRemaining === 2) {
            tickingAudio.loop = true;
            tickingAudio.play();
        }

        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            tickingAudio.pause();
            tickingAudio.currentTime = 0; 
            timeUpAudio.play();
            document.getElementById("result-message-1").innerText = "⌛";
            document.getElementById("result-message").innerText = "Time's up!";
            document.getElementById("para").innerText = "";
            document.getElementById("result-modal").style.display = "flex";
            document.getElementById("try-again-btn").style.display = "inline-block";
            moveToNextImage(); // Move to next image (but not visible yet)
        }
    }, 1000);
}

function resetGame() {
    updateImage(); // Now the next image updates only when "Try Again" or "Play Again" is clicked
    document.getElementById("choose-bin-btn").style.display = "block";
    document.getElementById("waste-image").style.width = "260px";
    document.getElementById("waste-image").style.height = "260px";
    document.getElementById("waste-image").style.borderRadius = "100%";
    document.getElementById("bins-container").style.display = "none";
    document.getElementById("result-modal").style.display = "none";
    document.getElementById("play-again-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "none";
    document.getElementById("timer-container").style.display = "none";
    document.getElementById("title").style.display = "block";
}

function startGame() {
    document.getElementById("choose-bin-btn").style.display = "none";
    document.getElementById("waste-image").style.width = "200px";
    document.getElementById("waste-image").style.height = "200px";
    document.getElementById("waste-image").style.borderRadius = "50%";
    document.getElementById("bins-container").style.display = "flex";
    document.getElementById("message").innerText = "";
    document.getElementById("play-again-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "none";
    document.getElementById("title").style.display = "none";
    startTimer(); // Start the timer when game starts
}

document.getElementById("choose-bin-btn").addEventListener("click", startGame);

document.querySelectorAll(".bin").forEach((bin) => {
    bin.addEventListener("click", function () {
        clearInterval(timerInterval);
        if (timeRemaining > 0) {
            let timeTaken = 5 - timeRemaining;
            if (this.id === images[currentIndex].correctBin) {
                tickingAudio.pause(); // Stop ticking if the player finishes before time's up
                tickingAudio.currentTime = 0;
                correctAnswerAudio.play(); 
                document.getElementById("result-message-1").innerText = "🎉";
                document.getElementById("result-message").innerText = `Well done! You sorted the waste in ${timeTaken} seconds.`;
                document.getElementById("para").innerText = `If ${timeTaken} seconds is all it takes, why not do it every day? If you don’t, your unsorted waste spends 500 years polluting our air, water, and land.`;
                document.getElementById("play-again-btn").style.display = "inline-block";
                moveToNextImage(); // Move to the next image but don't update yet

            } else {
                playWrongAnswerSound();
                document.getElementById("result-message-1").innerText = "👎";
                document.getElementById("result-message").innerText = "Oops! That doesn’t go there.";
                document.getElementById("para").innerText = "";
                document.getElementById("try-again-btn").style.display = "inline-block";
                moveToNextImage(); // Move to the next image but don't update yet
            }

            document.getElementById("result-modal").style.display = "flex";
            document.getElementById("bins-container").style.display = "none";
            document.getElementById("timer-container").style.display = "none";
        }
    });
});

document.getElementById("play-again-btn").addEventListener("click", resetGame);
document.getElementById("try-again-btn").addEventListener("click", resetGame);

function moveToNextImage() {
    currentIndex++; // Move to the next image
    if (currentIndex >= images.length) currentIndex = 0; // Reset if at last image
    localStorage.setItem("lastPlayedIndex", currentIndex);
}

// Load the last played image when the game starts
updateImage();
