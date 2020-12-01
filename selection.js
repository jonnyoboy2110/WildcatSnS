
//pauses and continues drawing animation
function pauseDraw(){
  if (!userPaused) {
    userPaused = true;
    document.getElementById("StopAndGoButton").innerHTML = "Continue";
  }
  else {
    document.getElementById("StopAndGoButton").innerHTML = "Pause";
    userPaused = false;
    swapVariableAnimationSelection();
  }

}

//resets highlights of code after being executed
function codeBackgroundResetAll(){
  for (var i = 1; i <= 3; i++) {
    document.getElementById("code" + i).style.backgroundColor = "white";
  }
}

//Set the explaination paragraph on page to the correct instruction that is being executed
function explainationSelection(action, var1,var2){
  exPTage = document.getElementById('explainationParagraph');
  switch (action) {
    case '<':
      exPTage.innerHTML =
      "Value " + var1 + " is less than " + var2 + ".\n " + var1 + " is still the smallest element seen so far.";
      break;
    case '>':
      exPTage.innerHTML =
      "Value " + var2 + " is greater than " + var1 + ".\n " + var2 + " is now the smallest elements seen so far";
      break;
    case 'Sorted':
      if (var1!=var2) {
      document.getElementById('sortedParagraph').innerHTML =
      var1 +
       " switched with the first unsorted element ("+
        var2 +
         "). " +
          var1 +
          " is now in its "+
          "sorted position".bold() +
           " It is colored as sorted"
      }
      else {
        document.getElementById('sortedParagraph').innerHTML =
        var1 +
        " is already in its" +
         " sorted ".bold() +
          "position. "+
           " It is colored as sorted"
      }
      break;
     case 'ReachTheEnd':
       exPTage.innerHTML =
       "All the elements are now " + "sorted!".bold();
       break;
  }
}

//Same swap animation but for Selection Sort
function swapVariableAnimationSelection(){
  setTimeout( function(){
    if (userPaused == true) {
      cancelAnimationFrame(globalID);
      return;
    }
    if (secondElement == lineArray.length) {
      displacementPerFrame = (lineArray[minElementIndex].position - lineArray[currentIndex].position)*(lineWidths)/lineWidths;
      if (movementLen >= lineWidths) {
        lineArray[minElementIndex].finished();
        explainationSelection('Sorted', lineArray[minElementIndex].height ,  lineArray[currentIndex].height);
        swapInLineArray(lineArray[minElementIndex] ,  lineArray[currentIndex]);
          currentIndex +=1 ;

          minElementIndex = currentIndex;
          secondElement = currentIndex+1;
          movementLen = 0;
          if (minElementIndex == lineArray.length-1) {
            explainationSelection('ReachTheEnd', -1,-1);
            bringBackAllColors();
            cancelAnimationFrame(globalID);
            drawAllLines();
            resetAllGlobals();
            return;
          }
      }
      else{
        pen.clearRect(0,0,canWidth,canHeight);
        drawOtherThan(lineArray[minElementIndex],lineArray[currentIndex]);
        lineArray[minElementIndex].drawMove(Math.min(-movementLen*displacementPerFrame, displacementPerFrame*lineWidths));
        lineArray[currentIndex].drawMove(Math.min(movementLen*displacementPerFrame, displacementPerFrame*lineWidths));
      }
      movementLen+=1*movmentSpeed;

    }
    else{
      if (lineArray[minElementIndex].height < lineArray[secondElement].height) {
        pen.clearRect(0,0,canWidth,canHeight);
        lineArray[minElementIndex].setColor('#8b728e');
        lineArray[secondElement].setColor('#8b728e');
        drawAllLines();
        drawPositionArrow(lineArray[minElementIndex] ,  lineArray[secondElement], 0 ,'<');
        explainationSelection('<', lineArray[minElementIndex].height ,  lineArray[secondElement].height);
      }
      else {
        pen.clearRect(0,0,canWidth,canHeight);
        lineArray[minElementIndex].setColor('#8b728e');;
        lineArray[secondElement].setColor('#8b728e');
        drawAllLines();
        drawPositionArrow(lineArray[minElementIndex] ,  lineArray[secondElement], 0 ,'>');
        explainationSelection('>', lineArray[minElementIndex].height ,  lineArray[secondElement].height);
      }
      movementLen+=1*movmentSpeed;
      if (movementLen > lineWidths) {
        codeBackgroundResetAll();
        bringBackAllColorsAfter(currentIndex);
        if (lineArray[minElementIndex].height > lineArray[secondElement].height) {
          minElementIndex = secondElement;
        }
        secondElement++;
        movementLen = 0;
      }
    }
    globalID = requestAnimationFrame(swapVariableAnimationSelection);
  }, 1000/framesPerSecond);
}

//Runs through selection sort
//Connected to selection sort button
function SelectionSort(){
  swapVariableAnimationSelection();
}
