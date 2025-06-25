// script.js

// Quiz Questions
const quiz = [
    {
      question: "What does HTML stand for?",
      answers: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
      correct: 1
    },
    {
      question: "Which language is used for styling web pages?",
      answers: ["HTML", "JQuery", "CSS", "XML"],
      correct: 2
    },
    {
      question: "Which is not a JavaScript Framework?",
      answers: ["Python Script", "JQuery", "Django", "NodeJS"],
      correct: 0
    }
  ];
  
  // DOM Elements
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const progressEl = document.getElementById("quiz-progress");
  const questionNumberEl = document.getElementById("question-number");
  const jokeBtn = document.getElementById("joke-btn");
  const revealBtn = document.getElementById("reveal-btn");
  const jokeSetupEl = document.getElementById("joke-setup");
  const jokePunchlineEl = document.getElementById("joke-punchline");
  const jokeLoadingEl = document.getElementById("joke-loading");
  const jokeCategoryEl = document.getElementById("joke-category");
  const themeSwitch = document.getElementById("theme-switch");
  
  // Quiz state
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 30;
  
  // Theme handling
  function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    themeSwitch.checked = savedTheme === 'dark';
    setTheme(savedTheme === 'dark');
  }
  
  themeSwitch.addEventListener('change', (e) => {
    setTheme(e.target.checked);
  });
  
  // Update current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Quiz functions
  function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleAnswer(false);
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    timerEl.textContent = `Time: ${timeLeft}s`;
  }
  
  function updateProgress() {
    const progress = ((currentQuestionIndex) / quiz.length) * 100;
    progressEl.style.width = `${progress}%`;
    questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}/${quiz.length}`;
  }
  
  function showQuestion(index) {
    const q = quiz[index];
    questionEl.textContent = q.question;
    answersEl.innerHTML = "";
    
    q.answers.forEach((answer, i) => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.onclick = () => handleAnswer(i === q.correct);
      answersEl.appendChild(btn);
    });

    updateProgress();
    startTimer();
  }
  
  function handleAnswer(isCorrect) {
    clearInterval(timer);
    
    if (isCorrect) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
    }

    const buttons = answersEl.getElementsByTagName("button");
    Array.from(buttons).forEach((btn, index) => {
      btn.disabled = true;
      if (index === quiz[currentQuestionIndex].correct) {
        btn.style.backgroundColor = "var(--secondary-color)";
        btn.style.color = "white";
      } else if (btn.textContent === quiz[currentQuestionIndex].answers[currentQuestionIndex] && !isCorrect) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "white";
      }
    });

    currentQuestionIndex++;
    
    if (currentQuestionIndex < quiz.length) {
      nextBtn.style.display = "flex";
    } else {
      showResults();
    }
  }
  
  function showResults() {
    questionEl.textContent = `Quiz completed! Your score: ${score}/${quiz.length}`;
    answersEl.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "flex";
    clearInterval(timer);
  }
  
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.textContent = "Score: 0";
    restartBtn.style.display = "none";
    showQuestion(currentQuestionIndex);
  }
  
  // Joke functions
  async function fetchJoke() {
    jokeLoadingEl.style.display = "flex";
    jokeSetupEl.textContent = "";
    jokePunchlineEl.textContent = "";
    jokePunchlineEl.classList.add("hidden");
    
    try {
      const category = jokeCategoryEl.value;
      const res = await fetch(`https://official-joke-api.appspot.com/jokes/${category}/random`);
      const data = await res.json();
      const joke = Array.isArray(data) ? data[0] : data;
      
      jokeSetupEl.textContent = joke.setup;
      jokePunchlineEl.textContent = joke.punchline;
      jokeLoadingEl.style.display = "none";
    } catch (error) {
      jokeSetupEl.textContent = "Failed to fetch joke. Please try again.";
      jokeLoadingEl.style.display = "none";
    }
  }
  
  function revealPunchline() {
    jokePunchlineEl.classList.remove("hidden");
  }
  
  // Event Listeners
  nextBtn.onclick = () => {
    showQuestion(currentQuestionIndex);
  };
  
  restartBtn.onclick = restartQuiz;
  jokeBtn.onclick = fetchJoke;
  revealBtn.onclick = revealPunchline;
  jokeCategoryEl.onchange = fetchJoke;
  
  // Initialize
  showQuestion(currentQuestionIndex);
  fetchJoke();
  