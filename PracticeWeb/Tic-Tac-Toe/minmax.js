class MinMaxNode {
  constructor(data, depth, index = 0) {
    this.data = data;
    //{~~ this following attributes will allow us to identify the node
    this.depth = depth;
    this.index = index;
    //~~}
    this.children = [];
  }
}
const scoreTable = {
  X: 1,
  O: -1,
  draw: 0,
};

class minmaxTree extends MinMaxNode {
  constructor(data, depth = 0,index=0, maxDepth, minVal, maxVal) {
    super(data, depth,index);
    this.maxDepth = maxDepth;
    this.maxVal = maxVal;
    this.minVal = minVal;
  }

  #evaluate(value) {
    if(this.maxDepth==0 || this.maxDepth == this.depth){
      return;
    }
    if (hasNull(this.data)) {
      let nullIndexes = getNulls(this.data);
      nullIndexes.forEach((i) => {
        let newArray = copy(this.data);
        let isGameOver = check(newArray);
        if (isGameOver == true) {
          return;
        }
        newArray[i] = value;
        let nextNode = new minmaxTree(
          newArray,
          this.depth+1,
          i,
          this.maxDepth,
          this.minVal,
          this.maxVal
        );
        this.children.push(nextNode);
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
  let s = false;
  for (i = 0; i < array.length; i++) {
    if (array[i] == null) {
      s = true;
      break;
    }
  }
  return s;
}
function copy(array) {
  return new Array(...array);
}

//now i need to find a way to create a function to print this tree in the console
function printNodes(tree,BEST_MOV, DOMnode = null) {
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
    let isBest = false;
    if (element.data==BEST_MOV.data) {
      console.log(element.data , BEST_MOV.data)
      isBest = true;
    }
    let childEle = createNode(isBest);
    childEle.innerHTML += `<p>${to2DBoard(element.data)}</p>`;
    DOMnode.querySelector(".children").append(childEle);
    printNodes(element,BEST_MOV, childEle);
  });
}
//function with boolean value that if the node being cerated is the next best move XD!
function createNode(isBest = false) {
  const node = document.createElement("div");
  const children = document.createElement("div");
  children.classList.add("children");
  children.setAttribute("style","display:none");
  node.classList.add("node");
  node.append(children);
  if(isBest){
    children.parentElement.classList.add('best-move')
   }
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
  let cp_arr = copy(array);
  let str = "";
  for (let i = 0; i < 9; i += 3) {
    let r1;
    cp_arr[i] == null ? (r1 = "__") : (r1 = cp_arr[i] + " ");
    let r2;
    cp_arr[i + 1] == null ? (r2 = "__") : (r2 = cp_arr[i + 1] + " ");
    let r3;
    cp_arr[i + 2] == null ? (r3 = "__") : (r3 = cp_arr[i + 2] + " ");
    str += `|${r1}|${r2}|${r3}| <br/>`;
  }
  return str;
}
function minimax(tree, isMaximizingPlayer) {
  let isGameOver = evaluate(tree.data);
  let score = 0;
  let BestMove = {
    value: null,
    // index:null,
    // depth:null,
    // child:null
  };
  if (isMaximizingPlayer) BestMove.value = -Infinity;
  else BestMove.value = Infinity;
  //if game is over then  return the evaluation of the board
  if (isGameOver != false) {
    BestMove.value = scoreTable[evaluate(tree.data)];
    BestMove.node = tree.data;
    // BestMove.index = tree.index;
    // BestMove.depth = tree.depth;
  } else {
    //if game is not over recursively call the minimax function and  get the best move from all possible moves
    tree.children.forEach((child) => {
      score = minimax(child, !isMaximizingPlayer).value;
      if (isMaximizingPlayer) {
        if (BestMove.value < score) {
          BestMove.value = score;
          BestMove.node  = child
          // BestMove.index = child.index;
          // BestMove.depth = child.depth;
        }
      } else if (!isMaximizingPlayer) {
        if (BestMove.value > score ) {
          BestMove.value = score;
          BestMove.node = child
          // BestMove.index = child.index;
          // BestMove.depth = child.depth;
        }
      }
    });
  }
  return BestMove;
}