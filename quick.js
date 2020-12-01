//pauses and continues drawing animation
function pauseDraw(){
  if (!userPaused) {
    userPaused = true;
    document.getElementById("StopAndGoButton").innerHTML = "Continue";
  }
  else {
    document.getElementById("StopAndGoButton").innerHTML = "Pause";
    userPaused = false;
    swapVariableAnimationQuick();
  }

}

//resets highlights of code after being executed
function codeBackgroundResetAll(){
  // for (var i = 1; i <= 3; i++) {
  //   document.getElementById("code" + i).style.backgroundColor = "white";
  // }
  //No code presented at the time
}

//Set the explaination paragraph on page to the correct instruction that is being executed
function explainationSelection(action, var1,var2){
  exPTage = document.getElementById('explainationParagraph');
  setPTag = document.getElementById('setParagraph');
  sortPTag = document.getElementById('sortedParagraph');
  switch (action) {
    case 'PivotAssign':
      setPTag.innerHTML  =
      "The Pivot is assigned to " +
      String(var1).bold() +
      " at index " +
      String(var2).bold();
      break;
    case 'PartitionArea':
      exPTage.innerHTML =
      "Currently looking at partition from index " +
      String(var1).bold() +
      " to " +
      String(var2).bold();
      break;
    case 'SingleValue':
      exPTage.innerHTML =
      "Size of partition is Equal to 1 [" +
      String(var2).bold() +
      "]. (" +
      String(var1.height).bold() +
      ") You can conclude from this that the element is in the sorted position.";
      break;
    case 'ElementStays':
      sortPTag.innerHTML =
      "Pivot Element (" +
      String(var1.height).bold() +
      ") is less than all the variable in partition so it so the element is in its sorted position at index " +
      String(var2).bold() +
      "."
      break;
    case '>':
      setPTag.innerHTML =
      "Pivot Element (" +
      String(var1.height).bold() +
      ") is " + "less than ".bold() +
      "(" +
      String(var2.height).bold() +
      ") so storeIndex stays the same."
      break;
    case '<':
      setPTag.innerHTML =
      "Pivot Element (" +
      String(var1.height).bold() +
      ") is " + "greater than ".bold() +
      "(" +
      String(var2.height).bold() +
      ") so Current Value switched with storeValue and then storeValue increase by 1."
      break;
    case 'ReachTheEnd':
      exPTage.innerHTML =
      "All the elements are now " + "sorted!".bold();
      break;

  }
}



function resetAllGlobalsQuick(){
  resetAllGlobals();
  currentIndex = 1;
  storeIndex = 1;
  pivotIndex = 0;
  leftIndex = 1;
  rightIndex = lineArray.length - 1;
  storeQ = [];
  highQ = [];
  lowQ = [];
  pivotFrame = 1;
  lowHighFrame = 0;
  singleValueFrame = 0;

}
currentIndex = 1;
var storeIndex = 1;
var pivotIndex = 0;
var leftIndex = 1;
var rightIndex = lineArray.length - 1;

var storeQ = [];
var highQ = [];
var lowQ = [];

var pivotFrame = 1;
var lowHighFrame = 0;
var singleValueFrame = 0;
//Same swap animation but for Quick Sort
function swapVariableAnimationQuick(){
  setTimeout( function(){
    //Pause functionality
    if (userPaused == true) {
      cancelAnimationFrame(globalID);
      return;
    }
    //shown assignment frames
    if (pivotFrame == 1) {
      lineArray[pivotIndex].pivot();
      drawAllLines();
      explainationSelection('PivotAssign',lineArray[pivotIndex].height , pivotIndex);
      drawSinglePositionArrow(lineArray[pivotIndex],["New Pivot"]);
    }
    else if (lowHighFrame == 1) {
      lineArray[leftIndex].partitionEdge();
      lineArray[rightIndex].partitionEdge();
      drawAllLines();
      drawSinglePositionArrow(lineArray[pivotIndex],["New Pivot"]);
      if(leftIndex == rightIndex){
        drawSinglePositionArrow(lineArray[leftIndex],["Low","High"]); 
      }
      else{
        drawSinglePositionArrow(lineArray[leftIndex],["Low"]);
        drawSinglePositionArrow(lineArray[rightIndex],["High"]);
      }
      explainationSelection('PartitionArea',leftIndex , rightIndex);
    }
    else if(singleValueFrame == 1 ){
      drawAllLines();
      drawSinglePositionArrow(lineArray[pivotIndex],["Single Variable"]);
      explainationSelection('SingleValue',lineArray[pivotIndex] , pivotIndex);

    }
    else{//movement Frames
      if (currentIndex > rightIndex) {
        displacementPerFrame = (lineArray[storeIndex-1].position - lineArray[pivotIndex].position);
        drawOtherThan(lineArray[pivotIndex],lineArray[storeIndex-1 ]);
        lineArray[pivotIndex].drawMove(Math.min(movementLen*displacementPerFrame, displacementPerFrame*lineWidths));
        lineArray[storeIndex-1].drawMove(Math.min(-movementLen*displacementPerFrame, displacementPerFrame*lineWidths));
        if (pivotIndex == storeIndex-1) {
          drawSinglePositionArrow(lineArray[pivotIndex],["Element Stays"]);
          explainationSelection('ElementStays',lineArray[pivotIndex] , pivotIndex);
        }
        else {
        drawSinglePositionArrow(lineArray[pivotIndex],["Pivot"]);
        drawSinglePositionArrow(lineArray[storeIndex-1],["Switching index"]);
        }
      }
      else if (lineArray[currentIndex].height < lineArray[pivotIndex].height) {
        displacementPerFrame = (lineArray[currentIndex].position - lineArray[storeIndex].position)*(lineWidths)/lineWidths;
        pen.clearRect(0,0,canWidth,canHeight);
        drawOtherThan(lineArray[currentIndex],lineArray[storeIndex]);
        lineArray[storeIndex].drawMove(Math.min(movementLen*displacementPerFrame, displacementPerFrame*lineWidths));
        lineArray[currentIndex].drawMove(Math.min(-movementLen*displacementPerFrame, displacementPerFrame*lineWidths));

        explainationSelection('PartitionArea',leftIndex , rightIndex);
        explainationSelection('<',lineArray[pivotIndex] , lineArray[currentIndex]);

        drawSinglePositionArrow(lineArray[pivotIndex],["Pivot"]);
        if (storeIndex == currentIndex) {
        drawSinglePositionArrow(lineArray[storeIndex],["storeIndex","Current Var"]);
        }
        else {
          drawSinglePositionArrow(lineArray[storeIndex],["storeIndex"]);
          drawSinglePositionArrow(lineArray[currentIndex],["Current Var"]);
        }

      }
      else {
        drawAllLines();
        explainationSelection('>',lineArray[pivotIndex] , lineArray[currentIndex]);
        drawSinglePositionArrow(lineArray[pivotIndex],["Pivot"]);

        if (storeIndex == currentIndex) {
        drawSinglePositionArrow(lineArray[storeIndex],["storeIndex","Current Var"]);
        }
        else {
          drawSinglePositionArrow(lineArray[storeIndex],["storeIndex"]);
          drawSinglePositionArrow(lineArray[currentIndex],["Current Var"]);
        }
      }
    }

    movementLen+=1*movmentSpeed;
    if (movementLen > lineWidths) {
      codeBackgroundResetAll();
      movementLen = 0;
      if (lowHighFrame == 1) {
        lowHighFrame = 0;
        lineArray[leftIndex].resetColor();
        lineArray[rightIndex].resetColor();
        currentIndex-=1;

      }
      else if (pivotFrame == 1) {
        pivotFrame = 0;
        lowHighFrame = 1;
        currentIndex-=1;
      }
      else if(singleValueFrame == 1){
        singleValueFrame = 0;
        currentIndex-=1;
        lineArray[pivotIndex].finished();
      }
      else {
        if (currentIndex > rightIndex) {//choosing  next high and lowe
          lineArray[pivotIndex].finished();
          swapInLineArray(lineArray[pivotIndex] ,  lineArray[storeIndex-1]);
          //storeQ.push(storeIndex);
          if (storeIndex != lineArray.length) {
            highQ.push(rightIndex);
            lowQ.push(storeIndex);
          }
          if (leftIndex >= 0) {
            highQ.push(storeIndex-2);
            lowQ.push(leftIndex-1);
          }
          let templow = lowQ.pop();
          let temphigh = highQ.pop();

          while (templow > temphigh) { // Exit condition
            if (highQ.length == 0) {
              bringBackAllColors();
              drawAllLines();
              explainationSelection('ReachTheEnd', -1,-1);
              resetAllGlobalsQuick();
              cancelAnimationFrame(globalID);
              
              return;
            }
            templow = lowQ.pop();
            temphigh = highQ.pop();
          }
          if (templow == temphigh) {

            singleValueFrame = 1;
          }
          else{
              pivotFrame =1;
          }
          pivotIndex = templow;
          rightIndex = temphigh;
          leftIndex = pivotIndex+1;
          currentIndex = leftIndex-1;
          storeIndex = leftIndex;

        }
        else if (lineArray[currentIndex].height < lineArray[pivotIndex].height) {
          swapInLineArray(lineArray[storeIndex] ,  lineArray[currentIndex]);
          storeIndex++;
      }
      }
      currentIndex+=1;
    }

    globalID = requestAnimationFrame(swapVariableAnimationQuick);
  }, 1000/framesPerSecond);
}

//Runs through selection sort
//Connected to selection sort button
function QuickSort(){
  swapVariableAnimationQuick();
}
