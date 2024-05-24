const questions = [
  "ちゅきちゅき",
  "かわちいい",
  "イケメン",
  "むむむ",
  "やはやはやは",
  "はにゃ?",
  "あせあせ",
  "きゅんきゅん",
  "まじまんじ",
];
const questionsNum = questions.length; // 問題の総数
let num = 0;
let question;
const result = document.querySelector(".result");
const word = document.querySelector(".word");

// 問題をランダムで出題させる関数
function setQuestion() {
  question = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
  word.textContent = question;
  num = 0;
  move.cancel();
  move.play();
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
  // エンターキーが押された時
  if (key === "Enter") {
    if (result.textContent == "[Enter] Game Start") {
      result.textContent = `${questionsNum}/${questionsNum}`;
      setQuestion();
      return;
    }
  }
  // タイプ時の処理
  if (key !== question[num]) {
    return;
  }
  // タイプ文字が合っていた時の処理
  num++;
  word.textContent = "".repeat(num) + question.substring(num);
  // 問題の単語をクリアした時
  if (num === question.length) {
    result.textContent = `${questions.length}/${questionsNum}`;
    move.currentTime -= 2000;
    if (move.currentTime < 0) {
      move.currentTime = 0;
    }
    // 全ての問題をクリアした時の処理
    if (questions.length === 0) {
      result.innerHTML = "おめでとう!! <span>[Enter]Restart Game</span>";
      move.pause();
      gameEnd();
      return;
    }
    setQuestion();
  }
}

// 文字を動かすアニメーション
const move = word.animate([{ transform: "translateX(100vw)" }, { transform: "translateX(-100vw)" }], {
  duration: 15000,
  fill: "forwards",
});
move.pause();

// ゲームオーバー処理
move.onfinish = () => {
  result.innerHTML = `${questions.length + 1}/${questionsNum} <span>[Enter]Restart Game</span>`;
  gameEnd();
};

// ゲーム終了時の処理
function gameEnd() {
  document.removeEventListener("keydown", keyDown);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      location.reload();
    }
  });
}





