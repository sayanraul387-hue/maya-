import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qepyxcepuatqlmqolrvy.supabase.co";
const SUPABASE_KEY = "sb_publishable_QKq1AjqnBye6MPl3afvfOw_h1UPQr9i";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ==========================
// QUESTIONS
// ==========================

const questions = [
  {
    question: "What is the nick name of MAYA?",
    options: [
      "BABY",
      "MAYA",
      "RONI",
      "DOGECH BAHI"
    ],
    answer: 1
  },

  {
    question: "WhAT IS THE LOCATION OF MAYA?",
    options: [
      "বস্তি তে",
      "ফুটপাথ এ ",
      "বাঁশবাগানে",
      "আকাশের নিচে মাটির উপরে "
    ],
    answer: 3
  },

  {
    question: "WHAT IS THE FAVOURITE THING THAT MAYA LOVES TO DO?",
    options: [
      "মেয়েদের পিছনে লাগা ",
      "হিজড়ামি করা ",
      "ব্যবসা করা ",
      " কুত্তামি করা "
    ],
    answer: [0, 1] // Duto-i correct answer
  },

  {
    question: "FIND THE SOURCE OF MAYA NAME ?",
    options: [
      "SABANG",
      "KOLKATA",
      "JOLDAPARAR হস্তী ",
      "NOTING"
    ],
    answer: 2
  },

  {
    question: "DO YOU LIKE MAYA?",
    options: [
      "YES",
      "MA KASAM YES",
      "ALLAH KASAM YES",
      "🖕"
    ],
    answer: 0
  },

  {
    question: "What is the favourite food of MAYA?",
    options: [
      "লোকের পোঁদ মেরে খাওয়া ",
      "নিজের টাকা তে খাওয়া ",
      "না খাওয়া ",
      "Nothing"
    ],
    answer: 0
  },

  {
    question: "The ultimate goal of MAYA?",
    options: [
      "রেলের পথ পরিষ্কার করা ",
      "ALP",
      "Manager in his own company",
      "Nothing"
    ],
    answer: 0
  }
];


// ==========================
// VARIABLES
// ==========================

let currentQuestion = 0;
let score = 0;
let answered = false;
let session = null;


// ==========================
// ELEMENTS
// ==========================

const questionElement =
  document.getElementById("question");

const optionsElement =
  document.getElementById("options");

const nextButton =
  document.getElementById("nextBtn");

const questionNumber =
  document.getElementById("questionNumber");

const scoreElement =
  document.getElementById("score");

const progressBar =
  document.getElementById("progressBar");

const logoutButton =
  document.getElementById("logoutBtn");


// ==========================
// LOGIN CHECK
// ==========================

async function checkAuthAndStart() {
  const { data } = await supabase.auth.getSession();
  session = data.session;

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  showQuestion();
}


// ==========================
// SHOW QUESTION
// ==========================

function showQuestion() {

  answered = false;

  const q = questions[currentQuestion];

  questionElement.textContent = q.question;

  questionNumber.textContent =
    `Question ${currentQuestion + 1} / ${questions.length}`;

  scoreElement.textContent =
    `Score: ${score}`;

  progressBar.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  optionsElement.innerHTML = "";

  q.options.forEach((option, index) => {

    const button = document.createElement("button");

    button.className = "option";

    button.textContent = option;

    button.addEventListener("click", () => {

      selectAnswer(index, button);

    });

    optionsElement.appendChild(button);

  });

  nextButton.style.display = "none";
}


// ==========================
// SELECT ANSWER
// ==========================

function selectAnswer(selectedIndex, selectedButton) {

  if (answered) return;

  answered = true;

  const correctAnswer = questions[currentQuestion].answer;
  const allOptions = document.querySelectorAll(".option");

  let isCorrect = false;

  // Check if answer is an Array (Multiple correct answers) or Single Number
  if (Array.isArray(correctAnswer)) {
    isCorrect = correctAnswer.includes(selectedIndex);
  } else {
    isCorrect = selectedIndex === correctAnswer;
  }

  allOptions.forEach((button, index) => {

    button.disabled = true;

    // Highlight all valid correct answers in Green
    if (Array.isArray(correctAnswer)) {
      if (correctAnswer.includes(index)) {
        button.classList.add("correct");
      }
    } else {
      if (index === correctAnswer) {
        button.classList.add("correct");
      }
    }

  });


  if (isCorrect) {
    score++;
    selectedButton.classList.add("correct");
  } else {
    selectedButton.classList.add("wrong");
  }


  scoreElement.textContent = `Score: ${score}`;

  nextButton.style.display = "block";
}


// ==========================
// NEXT QUESTION
// ==========================

nextButton.addEventListener("click", () => {

  currentQuestion++;

  if (currentQuestion < questions.length) {

    showQuestion();

  } else {

    showResult();

  }

});


// ==========================
// RESULT
// ==========================

async function showResult() {
  questionNumber.textContent = "Quiz Completed 🎉";

  questionElement.textContent =
    `Your Score: ${score} / ${questions.length}`;

  optionsElement.innerHTML = "";

  const percentage =
    Math.round((score / questions.length) * 100);

  // Save result to Supabase
  if (session && session.user) {
    const { error: saveError } = await supabase
      .from("quiz_results")
      .insert({
        user_id: session.user.id,
        score: score,
        total_questions: questions.length,
        percentage: percentage
      });

    if (saveError) {
      console.error("Result save error:", saveError);
    }
  }

  const resultMessage = document.createElement("p");

  resultMessage.textContent =
    `You scored ${percentage}%`;

  resultMessage.style.textAlign = "center";
  resultMessage.style.fontSize = "22px";
  resultMessage.style.marginTop = "20px";

  optionsElement.appendChild(resultMessage);

  nextButton.textContent = "Back to Home";
  nextButton.style.display = "block";

  nextButton.onclick = () => {
    window.location.href = "index.html";
  };
}


// ==========================
// LOGOUT
// ==========================

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {

    await supabase.auth.signOut();

    window.location.href = "login.html";

  });
}


// ==========================
// START
// ==========================

checkAuthAndStart();
