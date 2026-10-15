const welcome = document.getElementById("welcome");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const errorBox = document.getElementById("error");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

let questions = [];
let answers = [];
let current = 0;
let busy = false;

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

async function startQuiz() {
  if (busy) return;
  busy = true;
  startBtn.disabled = true;
  errorBox.classList.add("hidden");

  try {
    const response = await fetch("/api/questions");
    if (!response.ok) throw new Error("Could not load questions.");
    questions = await response.json();
    answers = Array(questions.length).fill(-1);
    current = 0;
    welcome.classList.add("hidden");
    result.classList.add("hidden");
    quiz.classList.remove("hidden");
    renderQuestion();
  } catch (error) {
    showError("Unable to start quiz. Check that the server is running, then try again.");
  } finally {
    busy = false;
    startBtn.disabled = false;
  }
}

function renderQuestion() {
  const item = questions[current];
  document.getElementById("counter").textContent = `QUESTION ${current + 1} / ${questions.length}`;
  document.getElementById("questionText").textContent = item.question;
  document.getElementById("progressBar").style.width = `${((current + 1) / questions.length) * 100}%`;
  document.getElementById("answered").textContent =
    `${answers.filter(answer => answer !== -1).length} of ${questions.length} answered`;

  const optionsBox = document.getElementById("options");
  optionsBox.replaceChildren();

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.setAttribute("aria-pressed", "false");

    if (answers[current] === index) {
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
    }

    button.addEventListener("click", () => {
      answers[current] = index;
      errorBox.classList.add("hidden");
      renderQuestion();
    });
    optionsBox.appendChild(button);
  });

  nextBtn.textContent = current === questions.length - 1 ? "Submit Quiz ✓" : "Next Question →";
}

async function submitQuiz() {
  if (busy) return;
  busy = true;
  nextBtn.disabled = true;

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    if (!response.ok) throw new Error("Submission failed.");
    const data = await response.json();

    quiz.classList.add("hidden");
    result.classList.remove("hidden");
    document.getElementById("score").textContent = `${data.score}/${data.total}`;
    document.getElementById("percentage").textContent = `${data.percentage}%`;
    document.getElementById("resultTitle").textContent =
      data.percentage >= 80 ? "Excellent Work!" :
      data.percentage >= 50 ? "Good Job!" : "Keep Practising!";
    document.getElementById("resultMessage").textContent =
      `You scored ${data.score} out of ${data.total} questions.`;
    errorBox.classList.add("hidden");
  } catch (error) {
    showError("Could not submit your quiz. Please try again.");
  } finally {
    busy = false;
    nextBtn.disabled = false;
  }
}

nextBtn.addEventListener("click", () => {
  if (busy) return;

  if (answers[current] === -1) {
    showError("Please select an option before continuing.");
    return;
  }

  errorBox.classList.add("hidden");
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    submitQuiz();
  }
});

startBtn.addEventListener("click", startQuiz);

restartBtn.addEventListener("click", () => {
  result.classList.add("hidden");
  welcome.classList.remove("hidden");
  errorBox.classList.add("hidden");
});
