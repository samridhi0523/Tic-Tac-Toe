const boxes = document.querySelectorAll(".box");
const rstBtn = document.querySelector("#reset-btn");
const newGame = document.getElementById("newGameBtn");
const bot = document.getElementById("bot");
const player = document.getElementById("player");
const selectionDiv = document.querySelector(".selection");
const gameContainerDiv = document.querySelector(".gameContainer");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const finishbtn = document.getElementById("finishBtn");
const message = document.getElementById("winnerMsg");
const player1 = document.getElementById("p1");
const player2 = document.getElementById("p2");
const buttons = document.querySelector(".buttons");
const user1Score = document.querySelector("#score1");
const user2Score = document.querySelector("#score2");
let playBot = false;
let score1 = 0;
let score2 = 0;
let gameOver = false;
let turnX = true;
let scoreUpdated = false;

boxes.forEach((box) => {
  box.addEventListener("click", async () => {
    buttons.style.display = "block";
    if (turnX) {
      box.innerText = "X";
      turnX = false;
    } else {
      box.innerText = "O";
      turnX = true;
    }
    box.disabled = true;

    checkWinner();

    if (gameOver) {
      disableBoxes();
      return;
    }
    if (playBot) {
      await delay(500);
      computerMove();
      turnX = false;
    }
  });
});

const winPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const resetGame = () => {
  turnX = true;
  gameOver = false;
  scoreUpdated = false;
  for (let box of boxes) {
    box.innerText = "";
    box.disabled = false;
  }
  message.style.display = "none";
  playBot ? startGame(true) : startGame(false);
};

const newG = () => {
      window.location.reload();
      return;  
};

const computer_choice = () => {
  const availableSpots = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableSpots.push(index);
    }
  });
  const compVal = Math.floor(Math.random() * availableSpots.length);
  return availableSpots[compVal];
};

const computerMove = () => {
  const choice = computer_choice();
  if (choice === undefined) {
    return;
  }
  const boxx = boxes[choice];
  boxx.innerText = "X";
  boxx.disabled = true;
  turnX = false;
  console.log(playBot);
  
  checkWinner();
  if (gameOver) {
    disableBoxes();
    return;
  }
  
};

const startGame = async (playWithBot) => {
  playBot = playWithBot;
  selectionDiv.style.display = "none";
  gameContainerDiv.style.display = "block";
  player1.innerText = playBot ? "Bot" : "Player 1";
  player2.innerText = playBot ? "You" : "Player 2";
  if (playBot) {
    await delay(500);
    computerMove();
  }
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const winnerMsg = async() => {
  let user1 = playBot ? "Bot" : "Player 1";
  let user2 = playBot ? "You" : "Player 2";
  console.log(user1,user2);
  message.style.display = "block";
  message.style.fontSize = "25px";
  message.style.color = "#D62828";
  if (score1 == score2 && score1 != 0) {
    message.innerHTML = `Both Won.<br>It's a tie`;
  } else if (score1 > score2) {
    message.innerHTML = `${user1} won the game!!!`;
  } else if (score1 < score2) {
    message.innerHTML = `${user2} won the game!!!`;
  } else {
    message.innerHTML = `No result!`;
  }
  await delay(1000);
  newG();
};

const checkWinner = () => {
  let patternFound = false;
    let user1 = playBot ? "Bot" : "Player 1";
    let user2 = playBot ? "You" : "Player 2";
  for (let i = 0; i < winPattern.length; i++) {
    const [pos1, pos2, pos3] = winPattern[i];
    let pos1Val = boxes[pos1].innerText;
    let pos2Val = boxes[pos2].innerText;
    let pos3Val = boxes[pos3].innerText;
    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val == pos2Val && pos3Val == pos1Val) {
        patternFound = true;
        gameOver = true;
        message.style.display = "block";
        if (pos1Val == "X" && !scoreUpdated) {
          score1++;
          message.innerHTML = `${user1} won this match.`;
          user1Score.innerText = score1;
          scoreUpdated = true;
        } else if (pos1Val == "O" && !scoreUpdated) {
          score2++;
          message.innerHTML = `${user2} won this match.`;
          user2Score.innerText = score2;
          scoreUpdated = true;
        }

        if (patternFound) {
          break;
        }
      }
    }
  }
  if (!patternFound && Array.from(boxes).every(box => box.innerText !== "")) {
    gameOver = true;
    message.style.display = "block";
    message.style.fontSize = "25px";
    message.style.color = "#D62828";
    message.innerHTML = `No winner!!!!!`;
  }
};

bot.addEventListener("click", () => startGame(true));
player.addEventListener("click", () => startGame(false));
finishbtn.addEventListener("click", winnerMsg);
rstBtn.addEventListener("click", resetGame);
newGame.addEventListener("click", newG);