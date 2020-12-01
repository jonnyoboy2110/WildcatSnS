//pauses and continues drawing animation
function pauseDraw(){
  if (!userPaused) {
    userPaused = true;
    document.getElementById("StopAndGoButton").innerHTML = "Continue";
  }
  else {
    document.getElementById("StopAndGoButton").innerHTML = "Pause";
    userPaused = false;
    swapVariableAnimation();
  }

}

//resets highlights of code after being executed
function codeBackgroundResetAll(){
  for (var i = 1; i <= 15; i++) {
    document.getElementById("code" + i).style.backgroundColor = "white";
  }
}
//Set the explaination paragraph on page to the correct instruction that is being executed
function explainationBubble(action, var1,var2){
  exPTage = document.getElementById('explainationParagraph');
  switch (action) {
    case '>':
      exPTage.innerHTML =
      "Value " + var1 + " is greater than " + var2 + ".\n So we swap the two variables in the array.";
      break;
    case '<=':
      exPTage.innerHTML =
      "Value " + var1 + " is less than " + var2 + ".\n No swap.";
      break;
    case 'NoSwap':
      exPTage.innerHTML =
      "There was no swap through an iteration in the array. \n All the variables are" + " sorted.".bold();
      break;
    case 'Sorted':
      document.getElementById('sortedParagraph').innerHTML =
      var1 + " is in its "+  "sorted position".bold() + " now. It is colored as sorted"
      break;
    case 'Flag':
      document.getElementById('setParagraph').innerHTML =
      "There was a swap in the array (" + var1 +"<->" + var2 + ") swapped is set to " + "true".bold();
      break;
    case 'FlagReset':
      document.getElementById('setParagraph').innerHTML =
      "Itterated through the whole array, Flag will be reset. swapped is set to " + "false".bold();
      break;
    default:

  }
}

/*
runs the animation of bubble sort on 'lineArray'
uses global variables:
    movementLen
    framesPerSecond
    currentIndex
    globalID
    thereWasASwap
    lineArray
*/
function swapVariableAnimation(){
  setTimeout( function(){
    if (userPaused == true) {
      cancelAnimationFrame(globalID);
      return;
    }
    if (currentIndex == lineArray.length - (1 + numAlreadyOrdered)) {
      currentIndex = 0;

      lineArray[lineArray.length - (1 + numAlreadyOrdered)].finished();
      explainationBubble('Sorted', lineArray[lineArray.length - (1 + numAlreadyOrdered)].height,-1);
      explainationBubble('FlagReset', -1,-1);
      numAlreadyOrdered +=1;
      if (!thereWasASwap) {
        explainationBubble('NoSwap', -1,-1);
        bringBackAllColors();
        cancelAnimationFrame(globalID);
        drawAllLines();
        resetAllGlobals();
        return;
      }
      thereWasASwap = false;
      }

      else if (lineArray[currentIndex].height > lineArray[currentIndex+1].height) {
        codeBackgroundGreen(["code6","code7","code8"]);
        explainationBubble('>', lineArray[currentIndex].height, lineArray[currentIndex+1].height);
        pen.clearRect(0,0,canWidth,canHeight);
        drawOtherThan(lineArray[currentIndex],lineArray[currentIndex+1]);
        lineArray[currentIndex].drawMove(movementLen);
        lineArray[currentIndex+1].drawMove(-movementLen);
        drawPositionArrow(lineArray[currentIndex] ,lineArray[currentIndex+1], movementLen ,'>');

      }
      else {
        //movementLen = lineWidths+1;
        codeBackgroundRed(["code6"]);
        explainationBubble('<=', lineArray[currentIndex].height, lineArray[currentIndex+1].height);
        pen.clearRect(0,0,canWidth,canHeight);
        drawAllLines();
        drawPositionArrow(lineArray[currentIndex] ,lineArray[currentIndex+1], 0 , '<=');

      }
      movementLen+=1*movmentSpeed;
      if (movementLen > lineWidths) {
        codeBackgroundResetAll();
        if (lineArray[currentIndex].height > lineArray[currentIndex+1].height) {
          thereWasASwap = true;
          explainationBubble('Flag', lineArray[currentIndex].height, lineArray[currentIndex+1].height);
          swapInLineArray(lineArray[currentIndex],lineArray[currentIndex+1]);
        }
        currentIndex += 1;
        movementLen = 0;
      }
      globalID = requestAnimationFrame(swapVariableAnimation);
  }, 1000/framesPerSecond);
}

//Runs through bubble sort
//Connected to bubble sort button
function BubbleSort(){
  swapVariableAnimation();
}
