function Node(row,col){
  this.col = col;
  this.row = row;
  this.isVisited = false;
  this.isDone =  false;
  this.isWall = false;
  this.start =  false;
  this.finish = false;
  this.dist = -1;
  this.prevCol = -1;
  this.prevRow = -1;

}
var canvas = document.getElementById("gridCell");

//document.getElementById("gridCell").style.width = document.getElementById("gridBin").style.width;
canvas.style.flexWrap = "wrap";
//document.getElementById("gridBin").style.height = (window.innerHeight - 80) + "px";
document.getElementById("gridCell").style.height = (window.innerHeight - 100) + "px";
var canWidth = document.getElementById("gridCell").offsetWidth;
var canHeight = document.getElementById("gridCell").offsetHeight;
canvas.width = canWidth;
canvas.height = canHeight;
var nodeSize = 25;
var grid = [];

var directions = [];
var path = []

var startNodeRow;
var startNodeCol;
var startNodeId;
var endNodeRow;
var endNodeCol;
var endNodeId;


//Chosing grid dimesions based on page size

document.getElementById('rowSlider').value = 10;
document.getElementById('rowLabel').innerHTML ="Rows = " + 10;

document.getElementById('colSlider').value = 10;
document.getElementById('colLabel').innerHTML ="Columns = " + 10;

//Setting up initial Grid on load
resetGrid(10,10);

//Start node

function setStart(Row, Col){
  startNodeRow = Row;
  startNodeCol = Col;
  startNodeId = "[" + Row + "," + Col + "]";
  grid[Row][Col].start = true;
  document.getElementById(startNodeId).style.background = "red";
}

//End Node

function setEnd(Row,Col){
  endNodeRow = Row;
  endNodeCol=  Col;
  endNodeId = "[" + Row + "," + Col + "]";
  grid[Row][Col].finish = true;
  document.getElementById(endNodeId).style.background = "green";
}

//Wall Nodes
function setWall(Row,Col){
  let wallNodeId = "[" + Row + "," + Col + "]";
  grid[Row][Col].isWall = true;
  document.getElementById(wallNodeId).style.background = "purple";
}


//dijkstra algorithm finds the path fro start node to end node
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
        runDirections();
        return;
      }
      else if (grid[neighborsList[i][0]][neighborsList[i][1]].isVisited == false 
        && grid[neighborsList[i][0]][neighborsList[i][1]].isWall == false) {
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

//Animation dedicated variables
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

//resetGlobal variables
function resetGlobals(){
  startNodeRow = -1;
  startNodeCol = -1;
  startNodeId = -1;
  endNodeRow = -1;
  endNodeCol = -1;
  endNodeId = -1;
  nodeSize = 1;
  grid = [];
  directions = [];
  path = [];
  currentIndex = 0;
  movementLen = 0;
  movmentSpeed = 1;

  userPaused = false;
}

//Reset's grid size
function resetGrid(rowSize, colSize){
  while (canvas.firstChild) {
    canvas.removeChild(canvas.lastChild);
  }
  for (let row = 0; row < rowSize; row++) {
    grid.push([]);
    for (let col = 0; col < colSize; col++) {
      grid[row].push(new Node(row,col))
    }
  }
  let squareWidths = (canvas.width)/colSize -1;
  let squareHeights = (canvas.height)/rowSize;
  for (let row = 0; row < grid.length; row++) {
    let divRow = document.createElement("div");
    divRow.style.overflow = "hidden";
    divRow.style.width = canvas.width + "px";
    for (let col = 0; col < grid[0].length; col++) {
      let div = document.createElement("div");
      div.style.width = squareWidths + "px";
      div.style.height = squareHeights + "px";
      div.style.background = "white";
      div.style.border = "2px solid black"
      div.style.color = "white";
      div.style.cssFloat = "left";
      div.className = "square";
      div.addEventListener("click",changeNodeState);
      div.id = "[" + row + "," + col + "]";
      divRow.appendChild(div);
    }
    document.getElementById("gridCell").appendChild(divRow);
  }
  //start node
  setStart(Math.floor(grid.length/2), (Math.floor(grid[0].length/4)));

  //End Node
  setEnd((Math.floor(grid.length/2)), Math.floor((grid[0].length/4) * 3));

}

//Takes user input of the slider and changes the size of the array
function changeRowSize(){
  cancelAnimationFrame(globalID);
  let rowSize = document.getElementById('rowSlider').value
  document.getElementById('rowLabel').innerHTML ="Rows = " + rowSize;
  let colSize = document.getElementById('colSlider').value
  document.getElementById('colLabel').innerHTML ="Columns = " + colSize;
  resetGlobals();
  resetGrid(rowSize, colSize);
}

function changeColSize(){
  cancelAnimationFrame(globalID);
  let rowSize = document.getElementById('rowSlider').value
  document.getElementById('rowLabel').innerHTML ="Rows = " + rowSize;
  let colSize = document.getElementById('colSlider').value
  document.getElementById('colLabel').innerHTML ="Columns = " + colSize;
  resetGlobals();
  resetGrid(rowSize, colSize);
}


function changeNodeState(evt){
 let tempRowCol = evt.currentTarget.id.replace("[","").replace("]","").split(",");
 let selRow = Number(tempRowCol[0]);
 let selCol = Number(tempRowCol[1]);
 let radio = document.querySelector('input[name="interactions"]:checked').id;

 if(radio == "startRadio"){
  grid[startNodeRow][startNodeCol].start = false;
  document.getElementById(startNodeId).style.background = "white";
   setStart(selRow,selCol);
 }
 else if(radio == "endRadio"){
  grid[endNodeRow][endNodeCol].finish = false;
  document.getElementById(endNodeId).style.background = "white";
  setEnd(selRow,selCol);
 }
 else if(radio = "wallRadio" && !((selRow == startNodeRow && selCol == startNodeCol) || (selRow == endNodeRow && selCol == endNodeCol) )){
    setWall(selRow,selCol);
 }

}