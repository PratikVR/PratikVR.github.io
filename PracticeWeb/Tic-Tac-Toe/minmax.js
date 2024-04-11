class MinMaxNode {
  constructor(data, depth) {
    this.data = data;
    this.depth = depth;
    this.children = [];
  }
  
}

const scoreTable = {
  'X': 1,
  'O': -1,
  'draw': 0,
};

class minmaxTree extends MinMaxNode {

  constructor(data, maxDepth, minVal, maxVal) {
    super(data,this.depth++)
    this.maxDepth = maxDepth;
    this.maxVal = maxVal;
    this.minVal = minVal;
  }

  #evaluate(value) {

    // if (this.depth == this.maxDepth) return;
    if (hasNull(this.data)) {
      let nullIndexes = getNulls(this.data);
      nullIndexes.forEach((i) => {
        let newArray = copy(this.data);
        let isGameOver = check(newArray);
        if (isGameOver != false) {
          return;
        }
        newArray[i] = value;
        this.children.push(
          new minmaxTree(newArray, this.maxDepth - 1, this.minVal, this.maxVal)
        );
      });
      this.children.forEach((child) => {
        if (value == this.minVal) {
          child.evaluateMax();
        } else {
          child.evaluateMin();
        }
      });

    }

  }
  evaluateMin() {
    this.#evaluate(this.minVal);
  }
  evaluateMax() {
    this.#evaluate(this.maxVal);
  }
}
function getNulls(array) {
  let s = [];
  for (i = 0; i < array.length; i++) {
    if (array[i] == null) {
      s.push(i);
    }
  }
  return s;
}
function hasNull(array) {
  let s =false;
  for (i = 0; i < array.length; i++) {
    if (array[i] == null) {
      s=true;
      break;
    }
  }
  return s;
}
function copy(array) {
  return Array.from(array);
}

//now i need to find a way to create a function to print this tree in the console
function printNodes(tree, DOMnode = null) {
  if (!DOMnode) {
    DOMnode = createNode();
    DOMnode.innerHTML += `<p>${to2DBoard(tree.data)}</p>`;
    let result = document.querySelector("#tree");
    result.innerHTML = `<h3>click on the nodes below to expand!</h3>`;
    result.append(DOMnode);
  }
  if (tree.children.length == 0) {
    DOMnode.innerHTML += `<p>${to2DBoard(tree.data)}</p>`;
    return;
  }
  tree.children.forEach((element) => {
    let childEle = createNode();
    childEle.innerHTML += `<p>${to2DBoard(element.data)}</p>`;
    DOMnode.querySelector(".children").append(childEle);
    printNodes(element, childEle);
  });
}

function createNode() {
  const node = document.createElement("div");
  const children = document.createElement("div");
  children.classList.add("children");
  children.setAttribute("style", "display:none");
  node.classList.add("node");
  node.append(children);
  node.addEventListener("click", (e) => {
    e.stopPropagation();
    let childrenEle = e.target.querySelector(".children");
    if (childrenEle.getAttribute("style") == "display:flex") {
      childrenEle.setAttribute("style", "display:none");
    } else if (childrenEle.getAttribute("style") == "display:none") {
      childrenEle.setAttribute("style", "display:flex");
    }
  });
  return node;
}

function to2DBoard(array) {
  let cparr = copy(array);
  let str = "";
  for (let i = 0; i < 9; i += 3) {
    let r1;
    cparr[i] == null ? (r1 = "__") : (r1 = cparr[i] + " ");
    let r2;
    cparr[i + 1] == null ? (r2 = "__") : (r2 = cparr[i + 1] + " ");
    let r3;
    cparr[i + 2] == null ? (r3 = "__") : (r3 = cparr[i + 2] + " ");
    str += `|${r1}|${r2}|${r3}| <br/>`;
  }
  return str;
}
function minimax(tree, isMaximizingPlayer) {
  let isGameOver = evaluate(tree.data);
  let score = 0;
  let BestScore = {
    value: null,
    node: null,
  };
  if (isMaximizingPlayer) BestScore.value = -Infinity;
  else BestScore.value = Infinity;
  //if game is over then  return the evaluation of the board
  if(isGameOver!=false){
    BestScore.value = scoreTable[evaluate(tree.data)]
    BestScore.node = tree;
  }else{
    //if game is not over recursively call the minimax function and  get the best move from all possible moves
    tree.children.forEach(child =>{
      score = minimax(child, !isMaximizingPlayer).value;
      console.log(score)
      if (isMaximizingPlayer) {
        
        if (BestScore.value < score) {
          BestScore.value = score;
          BestScore.node = child;
        }
      } else if (!isMaximizingPlayer) {
        
        if (BestScore.value > score) {
          BestScore.value = score;
          BestScore.node = child;
        }
      }
    })
  }
  return BestScore;
}