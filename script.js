const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const nextButton = document.getElementById("next-btn");
const resultElement = document.getElementById("result");

let currentQuestionIndex = 0;
let timeLeft = 30;
let timerInterval;
const userAnswers = [];
let questions = [];

const fetchQuestions = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data.slice(0, 10); // İlk 10 soru alındı.
};

const startQuiz = async () => {
  questions = await fetchQuestions();
  displayQuestion();
};

const displayQuestion = () => {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerElement.textContent = `Kalan Süre: ${timeLeft} saniye`;
  nextButton.classList.add("hidden");

  const question = questions[currentQuestionIndex];
  questionElement.textContent = `Soru ${currentQuestionIndex + 1}: ${
    question.title
  }`; // Soru numarası.

  const options = generateOptions(); // Cevaplar oluşturuldu.
  optionsElement.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.disabled = true; // İlk 10 saniye tıklanılamaması sağlandı.
    button.onclick = () => handleAnswer(option);
    optionsElement.appendChild(button);
  });

  startTimer();
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Kalan Süre: ${timeLeft} saniye`;

    if (timeLeft === 20) {
      enableOptions(); // 10.saniyeden sonra cevaplar etkinleştirildi.
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextButton.classList.remove("hidden");
      disableOptions(); // Zaman dolduktan sonra cevap verilememesi sağlandı.
      userAnswers[currentQuestionIndex] = null;
    }
  }, 1000);
};

const enableOptions = () => {
  const buttons = optionsElement.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
};

const disableOptions = () => {
  const buttons = optionsElement.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = true;
  });
};

const handleAnswer = (answer) => {
  userAnswers[currentQuestionIndex] = answer;
  disableOptions(); // Cevap verildikten sonra seçenekler devre dışı bırakıldı.
  nextButton.classList.remove("hidden");
};

const generateOptions = () => {
  const options = ["A", "B", "C", "D"].map((letter) => {
    const randomString = Math.random().toString(36).substring(2, 15); // Cevap şıkları rastgele oluşturuldu.
    return `${letter}: ${randomString}`;
  });
  return options;
};

nextButton.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showResults();
  }
};

const showResults = () => {
  clearInterval(timerInterval);
  questionElement.classList.add("hidden");
  optionsElement.classList.add("hidden");
  timerElement.classList.add("hidden");
  nextButton.classList.add("hidden");

  resultElement.classList.remove("hidden");
  resultElement.innerHTML = "<h2>Sonuçlar</h2><ul>";
  userAnswers.forEach((answer, index) => {
    resultElement.innerHTML += `<li>Soru ${index + 1}: ${
      answer ? answer : "Cevap verilmedi"
    }</li>`;
  });
  resultElement.innerHTML += "</ul>";
};

startQuiz();
