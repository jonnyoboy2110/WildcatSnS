function Node(row,col){
  this.col = col;
  this.row = row;
  this.isVisited = false;
  this.isDone =  false;
  this.start =  false;
  this.finish = false;
  this.dist = -1;
  this.prevCol = -1;
  this.prevRow = -1;

}
var canvas = document.getElementById("gridCell");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

document.getElementById("gridCell").style.width = document.getElementById("gridBin").style.width;
canvas.style.flexWrap = "wrap";
document.getElementById("gridBin").style.height = (window.innerHeight - 80) + "px";
document.getElementById("gridCell").style.height = (window.innerHeight - 100) + "px";
var canWidth = document.getElementById("gridCell").offsetWidth - 25;
var canHeight = document.getElementById("gridCell").offsetHeight;
canvas.width = canWidth;
canvas.height = canHeight;
var nodeSize = 50;
var grid = [];
for (let row = 0; row < (canvas.height-nodeSize)/nodeSize; row++) {

  grid.push([]);
  for (let col = 0; col < (canvas.width - nodeSize)/nodeSize; col++) {
    grid[row].push(new Node(row,col))
  }
}

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    let div = document.createElement("div");
    div.style.width = nodeSize + "px";
    div.style.height = nodeSize + "px";
    div.style.background = "white";
    div.style.border = "2px solid black"
    div.style.color = "white";
    div.className = "square";
    div.id = "[" + row + "," + col + "]";
    document.getElementById("gridCell").appendChild(div);
  }
}

//Start node
var startNodeRow;
var startNodeCol;
var startNodeId;
function setStart(Row, Col){
  startNodeRow = Row;
  startNodeCol = Col;
  startNodeId = "[" + Row + "," + Col + "]";
  grid[Row][Col].start = true;
  document.getElementById(startNodeId).style.background = "red";
}
setStart(Math.floor(grid.length/2), (Math.floor(grid[0].length/4)));

//End Node
var endNodeRow;
var endNodeCol;
var endNodeId;
function setEnd(Row,Col){
  endNodeRow = Col;
  endNodeCol=  Row;
  endNodeId = "[" + Row + "," + Col + "]";
  grid[Row][Col].finish = true;
  document.getElementById(endNodeId).style.background = "green";
}
setEnd((Math.floor(grid.length/2)), Math.floor((grid[0].length/4) * 3));

const squares = Array.from(document.querySelectorAll('#gridCell div'));
var directions = [];
var path = []
function dijkstra(){
  //Get Neighbors
  let currentNodeCol = startNodeCol;
  let currentNodeRow = startNodeRow;
  let currentNode = grid[startNodeRow][startNodeCol];
  currentNode.dist = 0;
  currentNode.isVisited = true;
  let q = [];
  q.push([startNodeRow,startNodeCol]);
  while (q.length > 0) {
    currentNodeRow = q[0][0];
    currentNodeCol = q[0][1];
    currentNode = grid[q[0][0]][q[0][1]];
    q.shift();
    let neighborsList = getNeighbors(currentNode);
    for (var i = 0; i < neighborsList.length; i++) {
      if (grid[neighborsList[i][0]][neighborsList[i][1]].finish == true) {
        grid[neighborsList[i][0]][neighborsList[i][1]].prevCol = currentNode.col;
        grid[neighborsList[i][0]][neighborsList[i][1]].prevRow = currentNode.row;
        currentNode = grid[neighborsList[i][0]][neighborsList[i][1]];
        currentNode.dist = grid[currentNode.prevRow][currentNode.prevCol].dist +1;

        while (currentNode.row != startNodeRow || currentNode.col != startNodeCol) {
          path.push([currentNode.row, currentNode.col, "path"])
          currentNode = grid[currentNode.prevRow][currentNode.prevCol];
        }
        path.reverse();
        directions = directions.concat(path);
        trigger();
        return;
      }
      else if (grid[neighborsList[i][0]][neighborsList[i][1]].isVisited == false) {
          grid[neighborsList[i][0]][neighborsList[i][1]].isVisited = true;
          grid[neighborsList[i][0]][neighborsList[i][1]].dist = currentNode.dist +1;
          grid[neighborsList[i][0]][neighborsList[i][1]].prevCol = currentNode.col;
          grid[neighborsList[i][0]][neighborsList[i][1]].prevRow = currentNode.row;
          directions.push([neighborsList[i][0], neighborsList[i][1], "visited"]);
          //document.getElementById("[" + neighborsList[i][0] + "," + neighborsList[i][1] + "]").style.background = "blue";

          q.push(neighborsList[i]);

      }
      else if(grid[neighborsList[i][0]][neighborsList[i][1]].isVisited == true &&
              grid[neighborsList[i][0]][neighborsList[i][1]].isDone == false){
        if (currentNode.dist+1 <  grid[neighborsList[i][0]][neighborsList[i][1]].dist) {
        grid[neighborsList[i][0]][neighborsList[i][1]].dist =   currentNode.dist+1;
        grid[neighborsList[i][0]][neighborsList[i][1]].prevCol = currentNode.col;
        grid[neighborsList[i][0]][neighborsList[i][1]].prevRow = currentNode.row;
        }

        // q.push(neighborsList[i]);

      }
    }
    //Done with this element. Will turn it into pink
    grid[currentNodeRow][currentNodeCol].isDone = true;
    directions.push([currentNodeRow, currentNodeCol, "isDone"]);
    //document.getElementById("[" + (currentNodeCol) + "," + (currentNodeRow) + "]").style.background = "pink";
  }

}

function getNeighbors(currentNode){
  nList = [];
  if (currentNode.col > 0) {
    nList.push([currentNode.row,currentNode.col-1]);
  }
  if (currentNode.col < grid[0].length-1) {
    nList.push([currentNode.row,currentNode.col+1]);
  }
  if (currentNode.row > 0) {
    nList.push([currentNode.row-1,currentNode.col]);
  }
  if (currentNode.row < grid.length-1) {
    nList.push([currentNode.row+1,currentNode.col]);
  }
  return nList;
}
var globalID;
var currentIndex = 0;
var movementLen = 0;
var movmentSpeed = 1;
var framesPerSecond = 144;
var userPaused = false;
function runDirections(){
  setTimeout( function(){
    if (userPaused == true) {
      cancelAnimationFrame(globalID);
      return;
    }
    if (currentIndex == directions.length) {

      cancelAnimationFrame(globalID);
      return;
    }
      if (directions[currentIndex][2] == "visited") {
        document.getElementById("[" + directions[currentIndex][0] + "," + directions[currentIndex][1] + "]").style.background = "blue";
      }
      else if (directions[currentIndex][2] == "isDone") {
        if (grid[directions[currentIndex][0]][directions[currentIndex][1]].start == false &&
        grid[directions[currentIndex][0]][directions[currentIndex][1]].finish == false) {
          document.getElementById("[" + directions[currentIndex][0] + "," + directions[currentIndex][1] + "]").style.background = "pink";
        }

      }
      else if (directions[currentIndex][2] == "path") {
        if (grid[directions[currentIndex][0]][directions[currentIndex][1]].start == false &&
        grid[directions[currentIndex][0]][directions[currentIndex][1]].finish == false) {
          document.getElementById("[" + directions[currentIndex][0] + "," + directions[currentIndex][1] + "]").style.background = "yellow";
        }

      }
      currentIndex += 1;
    globalID = requestAnimationFrame(runDirections);
  },10);
}



function trigger(){
  runDirections();
}
