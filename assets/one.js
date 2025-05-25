<script>
    let timeRemaining = 60;
    let timerInterval;
    let currentIndex = 0;
    let isPaused = false;
    let startTime;
    
    let tickingAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/4382"); // Timer ticking sound
    let timeUpAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/4352"); // Time’s up sound
    let correctAnswerAudio = new Audio("https://www.myinstants.com/media/sounds/correct-answer.mp3"); // Correct answer sound
    let wrongAnswerAudio = new Audio("https://www.myinstants.com/media/sounds/wrong-answer.mp3"); // Wrong answer sound
    let celebrationAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/4383"); // Celebration sound 🎉

    const images = [
        { src: "https://i.postimg.cc/vB4syWm4/banana-1.png", correctBin: "green-bin" },
        { src: "https://i.postimg.cc/CLkwdHsD/battery-1.png", correctBin: "black-bin" },
        { src: "https://i.postimg.cc/jSRY2V50/bottle-1.png", correctBin: "blue-bin" }
    ];

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
                    showModal("⌛", "Time’s up!", "", true, false);
                }
            }
        }, 1000);
    }

    function updateImage() {
        if (currentIndex < images.length) {
            document.getElementById('waste-image').src = images[currentIndex].src;
            document.getElementById('progress-tracker').innerText = `${images.length - currentIndex} items left`;
        } else {
            let timeTaken = Math.max((Date.now() - startTime) / 1000, 1);
            tickingAudio.pause();
            tickingAudio.currentTime = 0;
            celebrationAudio.play(); // 🎉 Play celebration sound
            showModal("🎉", `Well done! You sorted the waste in ${timeTaken} secs.`, `Sorting waste takes seconds, but prevents 500 years of pollution.`, false, true);
        }
    }

    document.querySelectorAll('.bin').forEach(bin => {
        bin.addEventListener('click', function() {
            if (!isPaused && currentIndex < images.length) {
                if (this.id === images[currentIndex].correctBin) {
                    correctAnswerAudio.play();
                    currentIndex++;
                    updateImage();
                } else {
                    wrongAnswerAudio.play();
                    setTimeout(() => {
                        showModal("👎", "Oops!", "That doesn’t go there.", true, false);
                    }, 500);
                }
            }
        });
    });

    function showModal(icon, title, body, showTryAgain, showPlayAgain) {
        clearInterval(timerInterval);
        isPaused = true;
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        document.getElementById('result-message-1').innerText = icon;
        document.getElementById('result-title').innerText = title;
        document.getElementById('result-body').innerText = body;
        document.getElementById('try-again-btn').style.display = showTryAgain ? 'block' : 'none';
        document.getElementById('play-again-btn').style.display = showPlayAgain ? 'block' : 'none';
        document.getElementById('result-modal').style.display = 'block';
    }

    document.getElementById('play-again-btn').addEventListener('click', startGame);
    window.onload = startGame;
</script>
