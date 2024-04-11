"use strict";
const cells = document.querySelectorAll(".cell");
let board = [];
let player1winCount = 0;
let player2winCount = 0;
let totalMatches = 0;
let turn = "X";
function initBoard() {
  for (let i = 0; i < 9; i++) {
    let cell = cells[i];
    cell.addEventListener("click", () => {
      let rotate = cell.querySelector(".rotate");
      if (
        rotate.style.getPropertyValue("--rotate-x-deg") == "0deg" &&
        rotate.style.getPropertyValue("--rotate-y-deg") == "0deg"
      ) {
        if (turn == "X") {
          rotate.style.setProperty("--rotate-y-deg", "90deg");
          play(i);
        } else if (turn == "O") {
          rotate.style.setProperty("--rotate-x-deg", "-90deg");
          play(i);
        }
      }
    });
  }
}
function initGame() {
  cells.forEach((el) => {
    let style = el.querySelector(".rotate").style;
    style.setProperty("--rotate-x-deg", "0deg");
    style.setProperty("--rotate-y-deg", "0deg");
  });
  board = [];
  for (let i = 0; i < 9; i++) {
    board.push(null);
  }
  turn = "X";
  
}

// false : game is not over , "X" or "O": winner , "draw" : match draw
function evaluate(boardState=board) {
  // let gameOver = true;
  for (let i = 0; i < 9; i++) {
    if (boardState[i] == null) {
      // break the loop and check if game is over or not!
      // gameOver = false;
      return check(boardState);
    }
  }
  let winner = check(boardState);
  if (!winner) {
    return "draw";
  }
  return winner;
}


// false : game is not over or draw  , "X"  or "O"  : game over
function check(array=board) {
  //diagonals
  if (
    array[0] &&
    array[4] &&
    array[8] &&
    array[0] == array[4] &&
    array[4] == array[8]
  ) {
    return array[0];
  }
  if (
    array[2] &&
    array[4] &&
    array[6] &&
    array[2] == array[4] &&
    array[4] == array[6]
  ) {
    return array[2];
  }
  for (let i = 0; i < 3; i++) {
    //rows
    if (
      array[i * 3] &&
      array[i * 3 + 1] &&
      array[i * 3 + 2] &&
      array[i * 3] == array[i * 3 + 1] &&
      array[i * 3 + 1] == array[i * 3 + 2]
    ) {
      return array[i * 3];
    }
    // cols
    if (
      array[i] &&
      array[i + 3] &&
      array[i + 6] &&
      array[i] == array[i + 3] &&
      array[i + 3] == array[i + 6]
    ) {
      return array[i];
    }
  }
  // if game is not over!
  return false;
}
// function to handle the user's move
function play(index) {
  board[index] = turn;
  drawTree(board);
  let winner = evaluate();
  if (winner == "draw") {
    totalMatches++;
    setTimeout(()=> {
      displayRes("it's a draw ! let's play again");
      initGame();
    }, 800);
  } else if (!winner) {
    turn = turn == "X" ? "O" : "X";
    displayRes(turn);
  } else {
    if(turn=='X'){
      player1winCount++
    }else if(turn=='O'){
      player2winCount++
    }
    totalMatches++;
    setTimeout(()=> {
      displayRes(`${winner} is the winner ! let's play again`);
      initGame();
    }, 800);
  }
}

function displayRes(textRes){
  document.querySelector('#res').innerHTML=`<div class="description">${textRes}</div>
  <div id='player1-score'>Player1 : ${player1winCount} </div>
  <div id='total-matches'>Total : ${totalMatches} </div>
  <div id='player2-score'>Player2: ${player2winCount}</div>`;
}

function drawTree(array){
  let root = new Array(...array);
  let tree = new minmaxTree(root, 6, "O", "X");
  if(turn=='O'){
    tree.evaluateMax()
  }
  else if(turn=="X"){
    tree.evaluateMin()
  }
  printNodes(tree)
  let nextMove
  if(turn=='X'){
    nextMove = minimax(tree,false)
  }
  else if(turn=='O'){
    nextMove = minimax(tree,true)
  }
  console.log(nextMove)
}

//game initialization
initGame();
initBoard();
let root = new Array(...board);
let tree = new minmaxTree(root, 6, "O", "X");
console.log(minimax(tree,true))