
//Colors {"OU Crimson Red":"8c231e","Ming":"3c6e71","Honeydew":"d0e1d4","Melon":"ffa69e","Mountbatten Pink":"8b728e","Mandarin":"ef8354"}

//Setting up canvas size and positioning of window
var canvas = document.getElementById("canvas");
document.getElementById("canvasBin").style.height = (window.innerHeight - 80) + "px";
document.getElementById("canvasCell").style.height = (window.innerHeight - 100) + "px";
var canWidth = document.getElementById("canvasCell").offsetWidth - 25;
var canHeight = document.getElementById("canvasCell").offsetHeight;
canvas.width = canWidth;
canvas.height = canHeight;
//Setting up the size of the explainer pannel
var explainer = document.getElementById("explainationBin");
explainer.style.height = (window.innerHeight- 34) - explainer.getBoundingClientRect().top + "px";
//Canvas drawing object
var pen = canvas.getContext("2d");
pen.font = "15px Source Code Pro"

//inital Values for testing
var lineWidths = 50; // width of each element
var lineBuffer = 5; // space between elements
var numOfElements = Math.floor(canWidth/(lineWidths-2)); // inital number of Value
var maxValueNum = 450; // inital max Value
var minValueNum = 50; // inital min Value

var lineArray = []; // array that holds the values
//Mouse trackiing functions TESTING
var mouse = {
  x : undefined,
  y : undefined
}
window.addEventListener('mouseover',
  function(event){
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.x - rect.left;
    mouse.y = event.y- rect.top;
  }
)
//meathod to adjust window components when window size changes TESTING
// window.addEventListener('resize',
//   function(){
//     canWidth = document.getElementById("canvasCell").offsetWidth - 25;
//     // document.getElementById("canvasCell").style.width  = canWidth;
//     canvas.width = canWidth;
//     updateCanvasVariables();
//     drawAllLines();
//
//   }
// )
//changes widths of lines to adjust for window size change
function updateCanvasVariables(){
  lineWidths = Math.floor((lineBuffer*(numOfElements-1) - canWidth)/numOfElements);
}
/*
These are the objects that will be used to sort
  objects have variable:
    int height
    int position
    string color which is in the format of 'rgb(x,y,z)' where x,y,v are numbers 0-255

    function draw() will draw the block on the canvas at its position
    function drawMove(displacement) will draw the block on the canvas at its position
      with a diplacement left or right. It was be displaced "displacement" points away
      from where it normally would be. Function is used for the animation


They will take in 'h' which is the height or value of the block
  must be positive
  to be able to see full block, 'h' must be under canvas height (canHeight)

They will also take in 'p' which is the position of the block in the array
  must be between 0 and lineArray.length -1
  should be the position where the block currenlty stands in the array

*/
function variableObj(h,p){
  this.height = h;
  this.position = p;

  //TESTING
  this.left;
  this.right;
  this.upper;
  this.lower;
  this.finished = false;

  let varRange = maxValueNum - minValueNum;
  let rgbConcat = '';
  let colorVal = 0;
  let colorTemp = h - minValueNum;
  //determines color of variable from green to red based on height
  if (colorTemp <= Math.floor(varRange/2) ) {
    colorVal = Math.floor(colorTemp/(varRange/2)*256);
    rgbConcat = 'rgb(' + colorVal +',255,110)';
  }
  else {
    colorVal= Math.floor((colorTemp-(varRange/2))/(varRange/2) * 256);
    rgbConcat = 'rgb(255,' + Math.abs(colorVal-255) +',110)';

  }
  this.originalColor = rgbConcat;
  this.curentColor = rgbConcat;

  this.draw = function(){
    //draws block at current position with coresponding color and value
    pen.fillStyle = this.curentColor;
    pen.fillRect(this.position*lineWidths,canHeight,lineWidths-lineBuffer,-this.height);
    pen.fillStyle = '#0000FF';
    pen.fillText(this.height,this.position * lineWidths,Math.floor(canHeight- this.height/2));
  }

  this.drawMove = function(displacement){
    pen.fillStyle = this.curentColor;
    pen.fillRect(this.position*lineWidths + displacement,canHeight,lineWidths-lineBuffer,-this.height);
    pen.fillStyle = '#0000FF';
    pen.fillText(this.height,this.position * lineWidths+ displacement,Math.floor(canHeight- this.height/2));
  }
  this.setPosition = function(pos){
    this.position = pos;
  }
  this.finished = function(){
    this.curentColor = '#3c6e71';
  }
  this.pivot = function(){
    this.curentColor = '#d0e1d4';
  }
  this.partitionEdge = function(){
    this.curentColor = '#988798';
  }
  this.resetColor = function(){
    this.curentColor = this.originalColor;
  }
  this.setColor = function(clr){
    this.curentColor = clr;
  }
}

// function resetLines takes param elements and recreates an array of values/blocks of size elements
//each variable will be given a random value
function resetLines(elements){
  if(elements != -1){
    numOfElements = elements;
  }
  lineWidths = Math.floor(canWidth/(numOfElements));
  lineArray = [];
  for (var i = 0; i < numOfElements; i++) {
    lineArray[i] = new variableObj(Math.floor((Math.random() * (maxValueNum-minValueNum)) + minValueNum),i)
  }
  resetAllGlobals();
  drawAllLines();
}

//Helper funciton to resent lines with new array in user input
function resetLinesWithInput(heights,n){
  numOfElements = n;
  movementLen = 0;
  userPaused = false;
  numAlreadyOrdered =0;
  thereWasASwap = false;
  currentIndex = 0;
  lineWidths = Math.floor(canWidth/(numOfElements));
  lineArray = [];
  for (var i = 0; i < numOfElements; i++) {
    lineArray[i] = new variableObj(heights[i],i);
  }
}

//Resets all global variables
//used after array is sorted so site wont break after sort has been done\
function resetAllGlobals(){
  movementLen = 0;
  userPaused = false;
  numAlreadyOrdered =0;
  thereWasASwap = false;
  currentIndex = 0;
  minElementIndex = currentIndex;
  secondElement = currentIndex+1;
  displacementPerFrame = 0;
}
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

/*funciton draws arrow above var1 objust on canvas and whne being swapped
 with var2. mve is the movment displacemnt to keep arrow about var1 while
 being switched
*/
function drawPositionArrow(var1,var2,mve,comparison){
  pen.fillText(var1.height + comparison +  var2.height ,var1.position * lineWidths + mve - 10 ,canHeight - var1.height -35);
  pen.beginPath();
  let x = var1.position * lineWidths + mve + Math.floor(lineWidths/2);
  let y =  canHeight - var1.height-10;
  //draws arrow
  pen.moveTo(x,y);
  pen.lineTo(x+15, y-10);
  pen.lineTo(x+5, y-10);
  pen.lineTo(x+5, y-20);
  pen.lineTo(x-5, y-20);
  pen.lineTo(x-5, y-10);
  pen.lineTo(x-15, y-10);
  pen.moveTo(x,y);
  pen.closePath();
  pen.fill();
}
/*funciton draws arrow above var1 object on canvas to label variable with @param label
 @param label is a list of strings, words will appear stacked if there are more than one
 */
function drawSinglePositionArrow(var1,label){
  for (var i = 0; i < label.length; i++) {
      pen.fillText(label[i] ,var1.position * lineWidths + 10 ,canHeight - var1.height -35 - (i*15));
  }

  pen.beginPath();
  let x = var1.position * lineWidths + Math.floor(lineWidths/2);
  let y =  canHeight - var1.height-10;
  //draws arrow
  pen.moveTo(x,y);
  pen.lineTo(x+15, y-10);
  pen.lineTo(x+5, y-10);
  pen.lineTo(x+5, y-20);
  pen.lineTo(x-5, y-20);
  pen.lineTo(x-5, y-10);
  pen.lineTo(x-15, y-10);
  pen.moveTo(x,y);
  pen.closePath();
  pen.fill();
}

//turns all line back to original color after sorted
function bringBackAllColors(){

    for (var i = 0; i < numOfElements; i++) {
      lineArray[i].resetColor();
    }
}
//turns all line back to original color after postion 'ci' in array
function bringBackAllColorsAfter(ci){

    for (var i = ci; i < numOfElements; i++) {
      lineArray[i].resetColor();
    }
}
//Highlights the line of code being executed while being sorted in green
function codeBackgroundGreen(lineIds){
  for (var i = 0; i < lineIds.length; i++) {
    document.getElementById(lineIds[i]).style.backgroundColor = "#d0e1d4";
  }
}
//Highlights the line of code being executed while being sorted in red
function codeBackgroundRed(lineIds){
  for (var i = 0; i < lineIds.length; i++) {
    document.getElementById(lineIds[i]).style.backgroundColor = "#8c231e";
  }
}



//Global variables for swapVariableAnimation(bubble)
var movementLen = 0; //displacement of swaping blocks
var framesPerSecond = 144; // speed of sort
var movmentSpeed = 1;
document.getElementById('speedSlider').value = movmentSpeed;
var currentIndex = 0; // index of the bubble sort
var globalID; // global animation variable
var thereWasASwap = false; // checks if a swap has occured within one runthrough of the array
var userPaused = false; // check if the user paused the animation
var numAlreadyOrdered =0;


//Selection sort variables
var minElementIndex = currentIndex;
var secondElement = currentIndex+1;
var displacementPerFrame;


//swaps lines in linearray
function swapInLineArray(var1,var2){
  posTemp1 = var1.position;
  posTemp2 = var2.position;

  lineArray[posTemp1] = var2;
  lineArray[posTemp1].setPosition(posTemp1);
  lineArray[posTemp2] = var1;
  lineArray[posTemp2].setPosition(posTemp2);
  //console.log(lineArray);

}



//Takes user input of the slider and changes the speed of the animation
function changeSpeed(){
  movmentSpeed = document.getElementById('speedSlider').value;
  document.getElementById('speedText').innerHTML = "  Speed = " + movmentSpeed;
}

//Takes user input of the slider and changes the size of the array
function changeSize(){
  cancelAnimationFrame(globalID);
  let arraySize = document.getElementById('sizeSlider').value;
  document.getElementById('sizeText').innerHTML = " Size = " + arraySize;
  resetAllGlobals();
  resetLines(arraySize);
}

//Takes in variables from input box and creates a new array of varibales
// @param ele is the users array input of numbers
function updateArraySize(ele){
  if (event.key === 'Enter') {
    cancelAnimationFrame(globalID);
    let tempNum = "";
    let tempArray = [];
    let input = ele.value.trim();
    let numberCount = 0
    for (var i = 0; i < input.length; i++) {
      if (input[i] == ' ') {
        tempArray.push(Number(tempNum));
        numberCount+=1;
        tempNum = "";
      }
      else {
        tempNum = tempNum+input[i]
      }
    }
    tempArray.push(Number(tempNum));
    numberCount+=1;
    let tempMin = tempArray[0];
    let tempMax = tempArray[0];
    for (var i = 1; i < tempArray.length; i++) {
      if (tempArray[i] < tempMin) {
        tempMin = tempArray[i];
      }
      if (tempArray[i] > tempMax) {
        tempMax = tempArray[i];
      }
    }
    maxValueNum = tempMax;
    minValueNum = tempMin;
    resetLinesWithInput(tempArray,numberCount);
  }
  drawAllLines();
}

//Runs when window loads to dray a random set on lines
resetLines(numOfElements);
drawAllLines();
