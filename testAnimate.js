var canWidth = 1000;
var canHeight = 600;
var canvas = document.getElementById("canvas");
canvas.width = canWidth;
canvas.height = canHeight;
var pen = canvas.getContext("2d");


var lineWidths = 50;
var lineBuffer = 5
var numOfElements = Math.floor(canWidth/(lineWidths-2));
var maxValueNum = 450;
var minValueNum = 50;

var lineArray = [];

function variableObj(h,p){
  this.height = h;
  this.position = p;
  let varRange = maxValueNum - minValueNum;
  let rgbConcat = '';
  let colorVal = 0;
  let colorTemp = h - minValueNum;
  //determines color of variable from green to red based on value
  if (colorTemp <= Math.floor(varRange/2) ) {
    colorVal = Math.floor(colorTemp/(varRange/2)*256);
    rgbConcat = 'rgb(' + colorVal +',255,0)';
  }
  else {
    colorVal= Math.floor((colorTemp-(varRange/2))/(varRange/2) * 256);
    rgbConcat = 'rgb(255,' + Math.abs(colorVal-255) +',0)';

  }
  this.color = rgbConcat;

  this.draw = function(){
    //draws block at current position with coresponding color and value
    pen.fillStyle = this.color;
    pen.fillRect(this.position*lineWidths,canHeight,lineWidths-lineBuffer,-this.height);
    pen.fillStyle = '#0000FF';
    pen.fillText(this.height,this.position * lineWidths + Math.floor(lineWidths/2),Math.floor(canHeight- this.height/2));
  }
  this.drawMove = function(displacement){
    pen.fillStyle = this.color;
    pen.fillRect(this.position*lineWidths + displacement,canHeight,lineWidths-lineBuffer,-this.height);
    pen.fillStyle = '#0000FF';
    pen.fillText(this.height,this.position * lineWidths + Math.floor(lineWidths/2) + displacement,Math.floor(canHeight- this.height/2));
  }
  this.setPosition = function(pos){
    this.position = pos;
  }
}

// function resetLines takes param elements and recreates an array of values/blocks of size elements
//each variable will be given a random value
function resetLines(elements){
  numOfElements = elements;
  lineWidths = Math.floor(canWidth/(numOfElements));
  //console.log(lineWidths);
  lineArray = [];
  for (var i = 0; i < numOfElements; i++) {
    lineArray[i] = new variableObj(Math.floor((Math.random() * (maxValueNum-minValueNum)) + minValueNum),i)
  }
}
resetLines(numOfElements);
console.log(lineArray);
//Draws all lines that are currently in the lineArray
function drawAllLines(){
  pen.clearRect(0,0,canWidth,canHeight);
  for (var i = 0; i < numOfElements; i++) {
    lineArray[i].draw();
  }
}

//Draws all lines that are currently in the lineArray except var1 and var2
function drawOtherThan(var1,var2){
  pen.clearRect(0,0,canWidth,canHeight);
  for (var i = 0; i < lineArray.length; i++) {
    if (!(var1.position == i || var2.position == i)) {
      lineArray[i].draw();
    }
  }
}
var tempVar1 = lineArray[0];
var tempVar2 = lineArray[1];
var movementLen = 0;
let framesPerSecond = 100;
var tempVar1Count = 0;
var globalID;
var currentSwap = 0;
function swapVariableAnimation(){
  setTimeout( function(){
      if (currentSwap == swapArray.length) {
          cancelAnimationFrame(globalID);
          return;
      }
        pen.clearRect(0,0,canWidth,canHeight);
        drawOtherThan(tempVar1,tempVar2);
        tempVar1.drawMove(movementLen);
        tempVar2.drawMove(-movementLen);
        movementLen+=1;
      if (movementLen > 50) {

        let posTemp1 = tempVar1.position;
        let posTemp2 = tempVar2.position;

        lineArray[posTemp1] = tempVar2;
        lineArray[posTemp1].setPosition(posTemp1);
        lineArray[posTemp2] = tempVar1;
        lineArray[posTemp2].setPosition(posTemp2);
        tempVar1Count += 1;
        tempVar1 = lineArray[tempVar1Count];
        tempVar2 = lineArray[tempVar1Count+1];
        movementLen = 0;
        currentSwap+=1;

      }
      globalID = requestAnimationFrame(swapVariableAnimation);
  }, 1000/framesPerSecond);
}
//drawAllLines();
function swapInLineArray(var1,var2){
  posTemp1 = var1.position;
  posTemp2 = var2.position;

  lineArray[posTemp1] = var2;
  lineArray[posTemp1].setPosition(posTemp1);
  lineArray[posTemp2] = var1;
  lineArray[posTemp2].setPosition(posTemp2);
  tempVar1Count += 1;
  tempVar1 = lineArray[tempVar1Count];
  tempVar2 = lineArray[tempVar1Count+1];
  //console.log(lineArray);

}
var swapArray = [];
function BubbleSort_OneCycle(){
  let high = lineArray[0].height;
  for (var i = 0; i < lineArray.length-1; i++) {
    if (lineArray[i].height > lineArray[i+1].height) {
      swapArray[i] = true;
    }
    else {
      swapArray[i] = false;
    }
  }
  swapVariableAnimation();
}
drawAllLines();
//BubbleSort_OneCycle();
