const questions = [
  { question: "猫", answer: "ねこ" },
  { question: "狸", answer: "たぬき" },
  { question: "犬", answer: "いぬ" },
  { question: "鳥", answer: "とり" },
  { question: "魚", answer: "さかな" },
  { question: "馬", answer: "うま" },
  { question: "猿", answer: "さる" },
  { question: "虎", answer: "とら" },
  { question: "獅子", answer: "しし" }
];

// 初期設定
const questionsNum = questions.length;
let num = 0;
let currentQuestion;
let score = 0;
let level = 1;
let time = 30;
const result = document.querySelector(".result");
const word = document.querySelector(".word");
const questionDisplay = document.querySelector(".question");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timeDisplay = document.getElementById("time");
const rankingList = document.getElementById("rankingList");

let timerInterval;

// 問題をランダムで出題させる関数
function setQuestion() {
  if (questions.length === 0) {
    gameEnd();
    return;
  }
  // 問題と答えをランダムに選択
  currentQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
  questionDisplay.textContent = currentQuestion.question;
  word.textContent = "_".repeat(currentQuestion.answer.length); // 正解前はアンダーバーを表示
  num = 0;
  time = 30 - (level - 1) * 5; // レベルが上がると制限時間が短くなる
  if (time < 10) time = 10; // 最低でも10秒は与える
  timeDisplay.textContent = time;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

// タイマーの更新
function updateTimer() {
  time--;
  timeDisplay.textContent = time;
  if (time <= 0) {
    clearInterval(timerInterval);
    gameEnd();
  }
}

// キーが押された時の処理
document.addEventListener("keydown", keyDown);
function keyDown(e) {
  handleKeyPress(e.key);
}

// 仮想キーボードのボタンが押された時の処理
function typed(e) {
  const input = e.target.value;
  if (input === "SPACE") {
    handleKeyPress(" ");
  } else {
    handleKeyPress(input.toLowerCase());
  }
}

// キープレスの処理を共通化
function handleKeyPress(key) {
  if (key === "Enter") {
    if (result.textContent === "[Enter] Game Start") {
      result.textContent = `${questionsNum}/${questionsNum}`;
      setQuestion();
      return;
    }
  }
  if (key !== currentQuestion.answer[num]) {
    return;
  }
  num++;
  score++;
  scoreDisplay.textContent = score;
  word.textContent = currentQuestion.answer.substring(0, num) + "_".repeat(currentQuestion.answer.length - num);
  if (num === currentQuestion.answer.length) {
    if (questions.length === 0) {
      result.innerHTML = "おめでとう!! <span>[Enter]Restart Game</span>";
      gameEnd();
      return;
    }
    if (score >= level * 10) { // スコアが一定以上でレベルアップ
      level++;
      levelDisplay.textContent = level;
    }
    setTimeout(() => {
      alert("正解: " + currentQuestion.answer); // 正解を表示
      setQuestion();
    }, 500); // 少し待ってから次の問題に進む
  }
}

// ゲーム終了時の処理
function gameEnd() {
  saveScore();
  displayRanking();
  document.removeEventListener("keydown", keyDown);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      location.reload();
    }
  });
  clearInterval(timerInterval);
}

// スコアをローカルストレージに保存する関数
function saveScore() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  localStorage.setItem("scores", JSON.stringify(scores.slice(0, 10)));
}

// ランキングを表示する関数
function displayRanking() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  rankingList.innerHTML = "";
  scores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}位: ${score}点`;
    rankingList.appendChild(li);
  });
}

// 初期状態を設定
result.textContent = "[Enter] Game Start";
word.textContent = "";
scoreDisplay.textContent = "0";
levelDisplay.textContent = "1";
timeDisplay.textContent = "30";
displayRanking();
