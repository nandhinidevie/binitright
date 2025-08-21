const questions = [
  {
    name: "Plastic Bottle",
    image: "https://cdn-icons-png.flaticon.com/512/2909/2909771.png",
    steps: [
      "Collect the plastic bottle",
      "Rinse and dry the bottle",
      "Sort into recyclable plastic bin",
      "Send for recycling"
    ]
  },
  {
    name: "Banana Peel",
    image: "https://cdn-icons-png.flaticon.com/512/590/590685.png",
    steps: [
      "Collect the banana peel",
      "Place in organic waste bin",
      "Transport to compost facility",
      "Convert into compost"
    ]
  },
  // {
  //   name: "Glass Bottle",
  //   image: "https://cdn-icons-png.flaticon.com/512/1146/1146883.png",
  //   steps: [
  //     "Collect the glass bottle",
  //     "Rinse and remove labels",
  //     "Sort into glass recycling bin",
  //     "Send to glass processing unit"
  //   ]
  // },
  // {
  //   name: "Old Newspaper",
  //   image: "https://cdn-icons-png.flaticon.com/512/2751/2751354.png",
  //   steps: [
  //     "Gather old newspapers",
  //     "Bundle them together",
  //     "Drop off at paper recycling center",
  //     "Recycle into new paper products"
  //   ]
  // },
  // {
  //   name: "Electronic Waste",
  //   image: "https://cdn-icons-png.flaticon.com/512/1034/1034118.png",
  //   steps: [
  //     "Identify and collect e-waste",
  //     "Store in designated e-waste box",
  //     "Take to authorized collection center",
  //     "Recycle responsibly"
  //   ]
  // }
];

let currentQuestion = 0;
let timer = 30;
let timerInterval;
let buttonMode = 'check';
let gameStartTime; // for total time tracking

const timerDisplay = document.getElementById('timer');
const wasteName = document.getElementById('waste-name');
const wasteImg = document.getElementById('waste-img');
const sortableList = document.getElementById('sortable');
const checkBtn = document.getElementById('checkBtn');
const popup = document.getElementById('popup');
const tryAgainBtn = document.getElementById('tryAgainBtn');

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function loadQuestion(index) {
  if (index === 0) {
    gameStartTime = Date.now(); // start total timer
  }

  const q = questions[index];
  wasteName.textContent = q.name;
  wasteImg.src = q.image;
  wasteImg.alt = q.name;

  const steps = shuffle([...q.steps]);
  sortableList.innerHTML = '';
  steps.forEach(step => {
    const div = document.createElement('div');
    div.textContent = step;
    div.classList.add('step-item');
    div.setAttribute('draggable', true);
    sortableList.appendChild(div);
  });

  makeSortable();
  startTimer();
  checkBtn.classList.add('disabled');
  checkBtn.textContent = "Check Answer";
  buttonMode = 'check';
  resetClasses();
}

function resetClasses() {
  sortableList.querySelectorAll('.step-item').forEach(div => {
    div.classList.remove('correct', 'wrong');
  });
}

function startTimer() {
  timer = 30;
  timerDisplay.textContent = `Time: ${timer}`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Time: ${timer}`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      popup.classList.add('show');
    }
  }, 1000);
}

function makeSortable() {
  let dragged;

  sortableList.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('step-item')) {
      dragged = e.target;
    }
  });

  sortableList.addEventListener('dragover', function (e) {
    e.preventDefault();
    const target = e.target;
    if (target && target !== dragged && target.classList.contains('step-item')) {
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) > rect.height / 2;
      sortableList.insertBefore(dragged, next ? target.nextSibling : target);
    }
  });

  sortableList.addEventListener('dragend', () => {
    checkBtn.classList.remove('disabled');
  });
}

function checkAnswer() {
  clearInterval(timerInterval);
  const userSteps = Array.from(sortableList.querySelectorAll('.step-item')).map(div => div.textContent.trim());
  const correctSteps = questions[currentQuestion].steps;

  let correct = true;

  sortableList.querySelectorAll('.step-item').forEach((div, i) => {
    div.classList.remove('correct', 'wrong');
    if (div.textContent.trim() === correctSteps[i]) {
      div.classList.add('correct');
    } else {
      div.classList.add('wrong');
      correct = false;
    }
  });

  if (correct) {
    checkBtn.textContent = currentQuestion < questions.length - 1 ? "Next Question" : "Finish";
    checkBtn.classList.remove('disabled');
    buttonMode = 'next';
  } else {
    checkBtn.textContent = "Try Again";
    checkBtn.classList.remove('disabled');
    buttonMode = 'retry';
  }
}

function restartGame() {
  popup.classList.remove('show');
  loadQuestion(currentQuestion);
}

// ✅ Modal function
function showModal(emoji, title, message, _, __, onClose) {
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  
  const modal = document.getElementById('customModal');
  modal.style.display = 'block';

  document.getElementById('modalCloseBtn').onclick = () => {
    modal.style.display = 'none';
    if (onClose) onClose();
  };
}

// ✅ Called after modal closes
function onModalClose() {
  currentQuestion = 0;
  loadQuestion(currentQuestion);
}

checkBtn.addEventListener('click', () => {
  if (checkBtn.classList.contains('disabled')) return;

  if (buttonMode === 'check') {
    checkAnswer();
  } else if (buttonMode === 'next') {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion(currentQuestion);
    } else {
      let timeTaken = Math.floor((Date.now() - gameStartTime) / 1000); // total time
      showModal(
        "🎉",
        `Well done! You sorted the waste in ${timeTaken} secs.`,
        `If ${timeTaken} seconds is all it takes, why not do it every day at WeWork too?`,
        false,
        true,
        onModalClose
      );
    }
  } else if (buttonMode === 'retry') {
    loadQuestion(currentQuestion);
  }
});

tryAgainBtn.addEventListener('click', restartGame);

// Start game
loadQuestion(currentQuestion);
