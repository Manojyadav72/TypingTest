
const targetEl = document.getElementById("text");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");

// Popup elements
const resultPopup = document.getElementById("resultPopup");
const resultTime = document.getElementById("resultTime");
const resultWpm = document.getElementById("resultWpm");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultErrors = document.getElementById("resultErrors");
const closePopup = document.getElementById("closePopup");

const passages = [
  "the morning air feels fresh and pure as the sun slowly rises above the fields children walk to school with bright eyes and happy thoughts eager to learn and grow farmers work in the soil with care planting seeds that will feed many people birds sing together while the cool breeze moves gently across the trees",

  "workers travel to offices with determination and energy to complete their goals the afternoon brings warmth and effort as tasks continue with steady focus evening arrives softly with families meeting and sharing food laughter and stories the night sky spreads calm silence filled with stars guiding everyone toward rest and hope",

  "life is a journey where each day brings lessons and chances to become stronger the rising sun paints the sky with light and fills hearts with courage and faith children learn from books and teachers while also discovering joy through play and friendship",

  "farmers grow crops with hard work giving food and life to the people of towns workers and traders build progress in cities where energy and movement never stop the afternoon heat reminds everyone of patience and the value of steady action for every hopeful soul tomorrow",

  "nature shows its beauty through shining rivers tall trees and endless skies full of wonder morning arrives with golden rays that spread across fields homes and hearts with joy children play laugh and learn while their minds grow strong with knowledge and curiosity farmers and workers give effort and time so that life continues with balance and growth",

  "the afternoon hours are filled with strength determination and the desire to achieve goals as the sun sets the colors of the sky remind everyone of peace and calm families unite in love sharing food and stories that strengthen bonds and trust the night falls softly bringing rest silence and the light of stars guiding tomorrow"
];

let passageWords = [];
let currentChunk = 0;
const chunkSize = 25; 

let idx = 0, started = false, timer, timeLeft, errors = 0, typed = 0;


function loadText() {
  const passage = passages[Math.floor(Math.random() * passages.length)];
  passageWords = passage.split(" ");
  currentChunk = 0;
  idx = 0;
  errors = 0;
  typed = 0;
  started = false;
  clearInterval(timer);
  timeLeft = parseInt(timeSelect.value);

  timeEl.textContent = timeLeft;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100";

  loadChunk();
}

function loadChunk() {
  targetEl.innerHTML = "";
  const chunkWords = passageWords.slice(
    currentChunk * chunkSize,
    (currentChunk + 1) * chunkSize
  );
  const text = chunkWords.join(" ");
  text.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch;
    if (i === 0) span.classList.add("active");
    span.classList.add("char");
    targetEl.appendChild(span);
  });
  idx = 0;
}

// timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

// update stats
function updateStats() {
  let minutes = (parseInt(timeSelect.value) - timeLeft) / 60;
  let wpm = Math.round((typed / 5) / minutes) || 0;
  let accuracy = Math.round(((typed - errors) / typed) * 100) || 100;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
}

// typing logic
document.addEventListener("keydown", (e) => {
  if (timeLeft <= 0) return;

  if (!started) {
    started = true;
    startTimer();
  }

  const spans = targetEl.children;

  if (e.key.length === 1) {
    typed++;
    const expected = spans[idx].textContent;
    if (e.key === expected) {
      spans[idx].classList.remove("active", "incorrect");
      spans[idx].classList.add("correct");
    } else {
      spans[idx].classList.remove("active");
      spans[idx].classList.add("incorrect");
      errors++;
    }

    idx++;
    if (idx < spans.length) {
      spans[idx].classList.add("active");
    } else {
      currentChunk++;
      if (currentChunk * chunkSize < passageWords.length) {
        loadChunk();
      } else {
        clearInterval(timer);
        showResults();
      }
    }
  } else if (e.key === "Backspace" && idx > 0) {
    spans[idx].classList.remove("active");
    idx--;
    spans[idx].classList.remove("correct", "incorrect");
    spans[idx].classList.add("active");
    typed--;
  }

  updateStats();
});


function showResults() {
  resultTime.textContent = parseInt(timeSelect.value);
  resultWpm.textContent = wpmEl.textContent;
  resultAccuracy.textContent = accuracyEl.textContent;
  resultErrors.textContent = errors;
  resultPopup.style.display = "flex";
}

restartBtn.addEventListener("click", () => {
  loadText();
  resultPopup.style.display = "none";
});

closePopup.addEventListener("click", () => {
  resultPopup.style.display = "none";
});
timeSelect.addEventListener("change", loadText);
loadText();
