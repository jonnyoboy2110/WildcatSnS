function Node(x,y){
  this.x = x;
  this.y = y;
  this.isVisited =false;
  this.isDone =  false;
  this.start =  false;
  this.finish = true;
}
var canvas = document.getElementById("gridCell");
canvas.style.flexWrap = "wrap";

canvas.style.width = document.getElementById("gridBin").style.width;
document.getElementById("gridBin").style.height = (window.innerHeight - 80) + "px";
document.getElementById("gridCell").style.height = (window.innerHeight - 100) + "px";
var canWidth = document.getElementById("gridCell").offsetWidth - 25;
var canHeight = document.getElementById("gridCell").offsetHeight;
canvas.width = canWidth;
canvas.height = canHeight;
var nodeSize = 50;
var grid = [];
for (let row = 0; row < canvas.height/nodeSize; row++) {

  grid.push([]);
  for (let col = 0; col < canvas.width/nodeSize; col++) {
    grid[row].push(new Node(col,row))
  }
}

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    let div = document.createElement("div");

    div.style.width = "50px";
    div.style.height = "50px";
    div.style.background = "red";
    div.style.border = "2px solid black"
    div.style.color = "white";

    div.className = "square";
    document.getElementById("gridCell").appendChild(div);
  }
}


console.log(grid);
