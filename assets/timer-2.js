        let timeRemaining = 60;
        let timerInterval;
        let currentIndex = 0;
        let isPaused = false;
        let startTime;
        let tickingAudio = new Audio("assets/ticking.mp3"); // Timer ticking sound
        let timeUpAudio = new Audio("assets/time-up.mp3"); // Time's up sound
        let correctAnswerAudio = new Audio("assets/correct.mp3"); // Correct answer sound
        let celebrationAudio = new Audio("https://www.fesliyanstudios.com/play-mp3/4383"); // Celebration sound 🎉

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
                    document.getElementById('timer-text').innerText = `${timeRemaining} sec`;

                    // Start ticking sound at 5 seconds remaining
                    if (timeRemaining === 5) {
                        tickingAudio.loop = true;
                        tickingAudio.play();
                    }

                    if (timeRemaining === 0) {
                        clearInterval(timerInterval);
                        tickingAudio.pause();
                        tickingAudio.currentTime = 0; // Reset the audio
                        timeUpAudio.play();
                        showModal("⌛", "Time’s up!", "", true, false);
                    }
                }
            }, 1000);
        }

         function startFireworks() {
        const fireworksContainer = document.getElementById('fireworks');
        fireworksContainer.style.display = 'block';

        for (let i = 0; i < 30; i++) { // More bursts for a grand effect
            let firework = document.createElement('div');
            firework.classList.add('firework');
            let color = `hsl(${Math.random() * 360}, 100%, 60%)`; // Random vibrant color

            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            firework.style.backgroundColor = color;
            firework.style.boxShadow = `0 0 10px ${color}`;

            fireworksContainer.appendChild(firework);

            setTimeout(() => {
                firework.remove();
            }, 2000);
        }

        // Hide fireworks after 3.5 seconds
        setTimeout(() => {
            fireworksContainer.style.display = 'none';
        }, 3500);
    }


        function updateImage() {
            if (currentIndex < images.length) {
                document.getElementById('waste-image').src = images[currentIndex].src;
                document.getElementById('progress-tracker').innerText = `${images.length - currentIndex} items left`;
            } else {
                let timeTaken = Math.round((Date.now() - startTime) / 1000);
                tickingAudio.pause(); // Stop ticking if the player finishes before time's up
                tickingAudio.currentTime = 0;
                celebrationAudio.play();
                startFireworks();
                showModal("🎉", `Well done! You sorted the waste in ${timeTaken} second${timeTaken > 1 ? 's' : ''}.`, `If ${timeTaken} second${timeTaken > 1 ? 's' : ''} is all it takes, why not do it every day? If you don’t, your unsorted waste spends 500 years polluting our air, water, and land.`, false, true);
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

        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('click', function() {
                if (!isPaused) {
                    if (this.id === images[currentIndex].correctBin) {
                        currentIndex++;
                        correctAnswerAudio.play(); // Play correct answer sound
                        updateImage();
                    } else {
                        playWrongAnswerSound();
                        showModal("👎", "Oops!", "That doesn’t go there.", true, false);
                    }
                }
            });
        });

        document.getElementById('try-again-btn').addEventListener('click', () => {
            document.getElementById('result-modal').style.display = 'none';
            if (timeRemaining <= 0) timeRemaining = 60;
            isPaused = false;
            startTimer();

        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.getElementById('result-modal').style.display = 'none';
            celebrationAudio.pause(); // Stop ticking if the player finishes before time's up
            celebrationAudio.currentTime = 0;
            startGame();
        });

        document.getElementById('share-game-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                let copyMessage = document.getElementById('copy-message');
                copyMessage.style.display = 'block';
                setTimeout(() => {
                    copyMessage.style.display = 'none';
                }, 5000);
            });
        });

window.onload = startGame;