

const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  progressText.innerHTML = `${value}`;
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
};

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

const startQuiz = async () => {
  const num = numQuestions.value,
    cate = category.value,
    diffi = difficulty.value;

  // API
  const API_URL = `https://opentdb.com/api.php?amount=${num}&category=${cate}&difficulty=${diffi}&type=multiple`;

  const response = await fetch(API_URL);
  const data = await response.json();
  questions = data.results;
  // fetch(API_URL).then((res)=> res.json()).then((data)=>{
  //   console.log(data);
  // })
  startScreen.classList.add("hide");
  quiz.classList.remove("hide");
  currentQuestion = 1;
  console.log(questions);
  showQuestion(questions[0]);
};

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

const showQuestion = (question) => {
  nextBtn.style.display = "none";
  const questionText = document.querySelector(".question"),
    answerWrapper = document.querySelector(".ans-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answers.sort(() => Math.random() - 0.5);
  answerWrapper.innerHTML = "";
  answers.forEach((answer) => {
    answerWrapper.innerHTML += `<div class="answer">
      <span class="text">${answer}</span>
      <span class="checkbox"> 
          <span class="icon">✔</span></span>
  </div>`;
  });

  questionNumber.innerHTML = `Question <span class="current">${
    questions.indexOf(question) + 1
  }</span><span class="total"> /${questions.length}</span>`;

  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answerDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });
  time = timePerQuestion.value;
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

const checkAnswer = () => {
  clearInterval(timer);

  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(answer);
    console.log(questions[currentQuestion - 1].correct_answer)
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.remove("wrong");
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
    }
  }
  else{
    const correctAnswer = document.querySelectorAll(".answer").forEach((answer)=>{
      if(answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer){
        answer.classList.remove("wrong")
        answer.classList.add("correct");
      }
    });
    console.log(correctAnswer);
  }

  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer)=>{
    answer.classList.add("checked");
  });

  submitBtn.disabled = true;
  nextBtn.style.display = "block";
};

nextBtn.addEventListener("click",()=>{
  nextQuestion();
});

const nextQuestion = () =>{
  if(currentQuestion < questions.length){
    currentQuestion++;
    showQuestion(questions[currentQuestion -1 ]);
  }else{
    showScore()
  }
}

const endScreen = document.querySelector(".end-screen"),
finalScore = document.querySelector(".final-score"),
totalScore = document.querySelector(".total-score");

const showScore = () =>{
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click",()=>{
  window.location.reload()
});
