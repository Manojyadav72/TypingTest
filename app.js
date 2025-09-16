const targetEl = document.getElementById("text");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");
const timeSelect = document.getElementById("timeSelect");

// Popup elements
const resultPopup = document.getElementById("resultPopup");
const resultTime = document.getElementById("resultTime");
const resultWpm = document.getElementById("resultWpm");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultErrors = document.getElementById("resultErrors");
const closePopup = document.getElementById("closePopup");

const passages = [
  "Typing is a skill you build with practice and patience.",
  "Discipline beats motivation when learning new skills.",
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript lets you add interactivity to web pages.",
  "Consistency is the key to improving your typing speed."
];

let text = "";
let idx = 0, started = false, timer, timeLeft, errors = 0, typed = 0;

// load new passage
function loadText() {
  text = passages[Math.floor(Math.random() * passages.length)];
  targetEl.innerHTML = "";
  text.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch;
    if (i === 0) span.classList.add("active");
    span.classList.add("char");
    targetEl.appendChild(span);
  });
  idx = 0;
  errors = 0;
  typed = 0;
  started = false;
  clearInterval(timer);
  timeLeft = parseInt(timeSelect.value);
  timeEl.textContent = timeLeft;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100";
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

  if (e.key.length === 1) { // character keys
    typed++;
    const expected = text[idx];
    if (e.key === expected) {
      spans[idx].classList.remove("active", "incorrect");
      spans[idx].classList.add("correct");
    } else {
      spans[idx].classList.remove("active");
      spans[idx].classList.add("incorrect"); // mark red
      errors++;
    }

    // Move forward no matter what
    spans[idx].classList.remove("active");
    idx++;
    if (idx < spans.length) spans[idx].classList.add("active");
  } else if (e.key === "Backspace" && idx > 0) {
    spans[idx].classList.remove("active");
    idx--;
    spans[idx].classList.remove("correct", "incorrect");
    spans[idx].classList.add("active");
    typed--;
  }

  updateStats();

  if (idx >= text.length) {
    clearInterval(timer);
    showResults();
  }
});

// Show results popup
function showResults() {
  resultTime.textContent = parseInt(timeSelect.value);
  resultWpm.textContent = wpmEl.textContent;
  resultAccuracy.textContent = accuracyEl.textContent;
  resultErrors.textContent = errors;
  resultPopup.style.display = "flex";
}

// Restart
restartBtn.addEventListener("click", () => {
  loadText();
  resultPopup.style.display = "none";
});

// Close popup
closePopup.addEventListener("click", () => {
  resultPopup.style.display = "none";
});

// Theme toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light")
    ? "Dark Mode"
    : "Light Mode";
});

// Reload text on time change
timeSelect.addEventListener("change", loadText);

// Initial load
loadText();
