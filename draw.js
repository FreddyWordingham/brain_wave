"use strict"; /* global network,selectedNode,networkCanvas,networkCTX,nodeCanvas,nodeCTX,knownCanvas,knownCTX,drawConnection,drawCircle,drawText,drawRect,drawLine,drawSector,rgbToHex,createArray,NODE_SLICES: true */


//  == Drawing Functions ==
//  -- Controller Function --
function drawAll(){
  //  Call the major drawing functions.

  var P       = network.numNodes;
  var A       = network.dataLength;

  drawNetwork(P);
  drawNode();
  drawKnownMatrix(P);
  drawPhaseData(P,A);
  drawOrderParameters(P,A);

  return;
}

//  -- Network Drawing --
function drawNetwork(P){
  //  Draw the network.

  var width   = networkCanvas.width;
  var height  = networkCanvas.height;
  networkCTX.clearRect(0,0,width,height);

  var radius  = width / (2.0 + ((3.0*network.numNodes)/Math.PI));
  var rho = (width/2.0) - radius;

  drawNetworkConnections(P,width,height,radius,rho);
  drawNetworkNodes(P,width,height,radius,rho);

  return;
}

function drawNetworkConnections(P,width,height,radius,rho){
	//  Draw the network connections

  var aveStrength = network.aveConStrength;
  var sdStrength  = network.sdConStrength;

  for (var q=0; q<P; q++){
    var theta0 = (((2*Math.PI)/P)*q) - (0.5*Math.PI);
    var x0 = rho * Math.cos(theta0);
    var y0 = rho * Math.sin(theta0);
    for (var o=0; o<P; o++){
      var theta1 = (((2*Math.PI)/P)*o) - (0.5*Math.PI);
      var x1 = rho * Math.cos(theta1);
      var y1 = rho * Math.sin(theta1);
      var connection = radius * ((network.coupMatrix[q][o] - aveStrength + (2.0*sdStrength)) / (4.0*sdStrength));
      var col = "black";
      if (q == selectedNode){
        col = "white";
      }
      drawConnection(networkCTX,x0+(0.5*width),y0+(0.5*height)+1,x1+(0.5*width),y1+(0.5*height)+1,connection,col);
    }
  }

	return;
}

function drawNetworkNodes(P,width,height,radius,rho){
  //  Draw the nodes of the network.

  for (var q=0; q<P; q++){
    var theta = (((2*Math.PI)/P)*q) - (0.5*Math.PI);
    var x = rho * Math.cos(theta);
    var y = rho * Math.sin(theta);
    drawCircle(networkCTX,x+(0.5*width),y+(0.5*height)+1,radius*2.0*network.node[q].lopDat[0],"yellow");
    if (q == selectedNode){
      drawCircle(networkCTX,x+(0.5*width),y+(0.5*height)+1,radius*1.1,"white");
    }
    else {
      drawCircle(networkCTX,x+(0.5*width),y+(0.5*height)+1,radius,"black");
    }
    drawCircle(networkCTX,x+(0.5*width),y+(0.5*height)+1,radius*0.9,network.node[q].colour);
    drawText(networkCTX,x+(0.5*width)-(0.3*radius),y+(0.49*height)+1+(0.5*radius),"black",q,Math.round(radius));
  }

  return;
}


//  -- Oscillator Drawing --
function drawNode(){
  //  Draw the selected node.

  var width   = nodeCanvas.width;
  var height  = nodeCanvas.height;
  nodeCTX.clearRect(0,0,width,height);

  var cx = width/2.0;
  var cy = height/2.0;
  var mainRad = cx/2.0;
  var oscRad = (Math.PI * mainRad)/(NODE_SLICES);
  var lowRad = mainRad - oscRad;
  var node = network.node[selectedNode];
  var N = node.numOsc;
  var counter = createArray(NODE_SLICES,0);
  var dTheta  = (2.0*Math.PI)/NODE_SLICES;
  for (var m=0; m<N; m++){
    var theta = node.osc[m].phase;
    var bin = Math.floor(theta/dTheta);
    counter[bin] += 1;
    var x = (lowRad * Math.cos(theta)) + cx;
    var y = (lowRad * Math.sin(theta)) + cy;
    drawCircle(nodeCTX,x,y,oscRad,node.osc[m].colour);
  }

  for (var i=0; i<NODE_SLICES; i++){
    var theta = dTheta * i;
    var phi   = theta + (dTheta);
    var radius = mainRad + (mainRad * (counter[i]/N));
    drawSector(nodeCTX,cx,cy,mainRad,radius+1,theta,phi,"blue");
  }

  var dx = cx + (node.lopDat[0] * mainRad * Math.cos(node.phaseDat[0]));
  var dy = cy + (node.lopDat[0] * mainRad * Math.sin(node.phaseDat[0]));
  drawLine(nodeCTX,cx,cy,dx,dy,"yellow",2);
}


//  -- Known Coupling Matrix Drawing --
function drawKnownMatrix(P){
  // Draw the known coupling matrix.

  var width   = knownCanvas.width;
  var height  = knownCanvas.height;
  knownCTX.clearRect(0,0,width,height);

  var aveStrength = network.aveConStrength;
  var sdStrength  = network.sdConStrength;

  var gap = 5;
  var w = Math.round((knownCanvas.width  - (gap * (P+1)))/P);
  var h = Math.round((knownCanvas.height - (gap * (P+1)))/P);

  for (var q=0; q<P; q++){
    for (var o=0; o<P; o++){
      var x1  = gap + (q * (gap + w));
      var y1  = gap + (o * (gap + h));
      var x   = Math.round(255 * ((network.coupMatrix[q][o] - aveStrength + (2.0*sdStrength)) / (4.0*sdStrength)));
      var col = rgbToHex(x,0,255-x);
      if (q==selectedNode){
        drawRect(knownCTX,x1-(0.5*gap),y1-(0.5*gap),w+gap,h+gap,"white");
      }
      if (q == o){
        drawRect(knownCTX,x1,y1,w,h,"white");
      }
      else {
        drawRect(knownCTX,x1,y1,w,h,col);
      }
    }
  }

  return;
}


//  -- Phase Data Drawing --
function drawPhaseData(P,A){
  //  Draw out the phase data lines.

  var width = phaseCanvas.width;
  var height = phaseCanvas.height;
  phaseCTX.clearRect(0,0,width,height);

  for (var q=0; q<P; q++){
    var axis = (height/P) * (q+0.5);
    var col = network.node[q].colour;
    var x0 = 0;
    var y0 = axis + (network.node[q].lopDat[0] * Math.sin(network.node[q].phaseDat[0]) * (height/(2*P)));
    var x1;
    var y1;
    for (var i=1; i<A; i++){
      x1 = (i+1)*(width/(A-1));
      y1 = axis + (network.node[q].lopDat[i] * Math.sin(network.node[q].phaseDat[i]) * (height/(2*P)));
      if (selectedNode == q){
        drawLine(phaseCTX,x0,y0,x1,y1,"white",4);
      }
      drawLine(phaseCTX,x0,y0,x1,y1,col,2);
      x0 = x1;
      y0 = y1;
    }
  }

  return;
}


//  -- Order Parameter Drawing --
function drawOrderParameters(P,A){
  //  Draw the order parameter graph.


  var width = orderCanvas.width;
  var height = orderCanvas.height;
  orderCTX.clearRect(0,0,width,height);

  var axis = height * 0.875;
  for (var q=0; q<P; q++){
    var col = network.node[q].colour;
    var x0 = 0;
    var y0 = axis - (network.node[q].lopDat[0] * 0.25 * height);
    var x1 = 0;
    var y1 = axis;
    for (var i=0; i<A; i++){
      x1 = i*(width/(A-1));
      y1 = axis - (network.node[q].lopDat[i] * 0.25 * height);
      if (selectedNode == q){
        drawLine(orderCTX,x0,y0,x1,y1,"white",4);
      }
      drawLine(orderCTX,x0,y0,x1,y1,col,2);
      x0 = x1;
      y0 = y1;
    }
  }

  axis = height * 0.375;
  var x0 = 0;
  var y0 = axis - (network.gopDat[0] * 0.25 * height);
  var x1;
  var y1;
  for (var i=0; i<A; i++){
    x1 = i*(width/(A-1));
    y1 = axis - (network.gopDat[i] * 0.25 * height);
    drawLine(orderCTX,x0,y0,x1,y1,"white",2);
    x0 = x1;
    y0 = y1;
  }

  return;
}
