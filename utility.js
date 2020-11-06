"use strict"; /* global SMALL: true */


//  == Utility Functions ==
//  -- Random Number Generation --
//  Random Number Generation
function getRandom(min,max){
  //  Generates a random number between min (inclusive) and max (exclusive).

  return ((Math.random()*(max-min))+min);
}

function getNormalRandom(mean,standardDeviation){
  //  Generate a random number following a normal distribution probability.
  //  Uses the Box-Muller transform.

  var done      = false;
  var z0;

  while (done === false){
    var u1 = Math.random();
    var u2 = Math.random();

    z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos((2.0*Math.PI) * u2);
    z0 = (z0 * standardDeviation) + mean

    if ((z0 > 0.0) && (z0 < (2.0*mean))){
      done = true;
    }
  }

  return (z0);
}


//  -- Colour Creation --
function getRainbowRandomColour(q,P){
  //  Create a random hex colour string and return it.

  var deg = 360.0 * (q/P);
  var r,g,b;

  //  Determine red
  if ((deg >= 0.0) && (deg < 60.0)){
    r = 255;
  }
  else if ((deg >= 60.0) && (deg < 120.0)){
    var x = (deg - 60.0)/60.0;
    x = 1.0 - x;
    r = Math.round(255 * x);
  }
  else if ((deg >= 240) && (deg < 300)){
    var x = (deg - 240.0)/60.0;
    r = Math.round(255 * x);
  }
  else if (deg >= 300){
    r = 255;
  }
  else {
    r = 0;
  }

  //  Determine green
  if ((deg >= 0.0) && (deg < 60.0)){
    var x = deg/60.0;
    g = Math.round(255 * x);
  }
  else if ((deg >= 60.0) && (deg < 180.0)){
    g = 255;
  }
  else if ((deg >= 180.0) && (deg < 240.0)){
    var x = (deg - 180.0)/60.0;
    x = 1.0 - x;
    g = Math.round(x * 255);
  }
  else {
    g = 0;
  }

  //  Determine blue
  if ((deg >= 120.0) && (deg < 180.0)){
    var x = (deg - 120.0)/60.0;
    b = Math.round(x * 255);
  }
  else if ((deg >= 180.0) && (deg < 300.0)){
    b = 255;
  }
  else if ((deg >= 300.0) && (deg < 360.0)){
    var x = (deg - 300.0)/60.0;
    x = 1.0 - x;
    b = Math.round(x * 255);
  }
  else {
    b = 0;
  }

  return (rgbToHex(r,g,b));
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


//  -- Array Creation --
function createArray(length,x){
  //  Create an array of length filled with x.

  var array = [];
  for (var i=0; i<length; i++){
    array.push(x);
  }

  return (array);
}

function createMatrix(rows,cols,x){
  //  Create a rows by cols matrix filled with x.

  var matrix = [];
  for (var i=0; i<rows; i++){
    matrix.push([]);
    for (var j=0; j<cols; j++){
      matrix[i].push(SMALL);
    }
  }

  return (matrix);
}


//  -- Basic Drawing Functions --
function drawCircle(thisCTX, x, y, r, colour){
  //  Draw a circle of radius r at (x,y) with colour.

  thisCTX.beginPath();
  thisCTX.arc(x,y,r,0,Math.PI*2);
  thisCTX.closePath();
  thisCTX.fillStyle = colour;
  thisCTX.fill();

  return;
}

function drawSector(thisCTX, x, y,r0, r1, theta, phi, colour){
  //  Draw a circle of radius r at (x,y) with colour.

  thisCTX.beginPath();
  thisCTX.arc(x,y,r0,theta,phi,false);
  thisCTX.arc(x,y,r1,phi,theta,true);
  thisCTX.closePath();
  thisCTX.fillStyle = colour;
  thisCTX.fill();

  return;
}

function drawRect(thisCTX, x1, y1, x2, y2, colour){
  //  Draw a rectangle between points (x1,y1) and (x2,y2).

  thisCTX.beginPath();
  thisCTX.fillStyle = colour;
  thisCTX.fillRect(x1,y1,x2,y2);
  thisCTX.fill();

  return;
}

function drawLine(thisCTX, x1, y1, x2, y2, colour, width){
  //  Draw a line on thisCTX canvas from (x1,y1) to (x2,y2) with width.

  thisCTX.lineWidth = width;
  thisCTX.strokeStyle = colour;
  thisCTX.beginPath();
  thisCTX.moveTo(x1,y1);
  thisCTX.lineTo(x2,y2);
  thisCTX.stroke();

  return;
}

function drawConnection(thisCTX, x1, y1, x2, y2, width, colour){
  //  Draw a line on thisCTX canvas from (x1,y1) to (x2,y2) with width.

  thisCTX.lineWidth = width;

  var grad = thisCTX.createLinearGradient(x1,y1,x2,y2);
  grad.addColorStop(0,colour);
  grad.addColorStop(1,'rgba(0,0,0,0)');
  thisCTX.strokeStyle = grad;

  thisCTX.beginPath();
  thisCTX.moveTo(x1,y1);
  thisCTX.lineTo(x2,y2);
  thisCTX.stroke();

  return;
}

function drawText(thisCTX,x,y,colour,text,size){
  //  Write text to thisCTX canvas.

  var font = size + "px Arial";
  thisCTX.font = font;
  thisCTX.fillStyle = colour;
  thisCTX.fillText(text,x,y);

  return;
}
