"use strict"; /* global network,createArray,createNetworkObject,generateCouplingMatrix: true */


//  == Network Creation Functions ==
//  -- Control Function --
function createNewNetwork(){
  //  Calls functions to create a new network.

  var iteration       = 0;
  var completeNetwork = Boolean(document.getElementById("completeNetworkInput").checked);
  var networkType     = getNetworkType();
  var dataLength      = Number(document.getElementById("dataLengthInput").value);
  var timeStep        = Number(document.getElementById("timeStepInput").value);
  var numNodes        = Number(document.getElementById("numNodesInput").value);
  var gopDat          = createArray(dataLength,0);
  var globalCoupParam = Number(document.getElementById("globalCoupParamInput").value);
  var aveConStrength  = Number(document.getElementById("aveConnectionStrengthInput").value);
  var sdConStrength   = Number(document.getElementById("sdConnectionStrengthInput").value);
  var coupMatrix      = generateCouplingMatrix(numNodes,completeNetwork,networkType,aveConStrength,sdConStrength);
  var aveOscFreq      = Number(document.getElementById("aveOscFreqInput").value);
  var sdOscFreq       = Number(document.getElementById("sdOscFreqInput").value);
  var aveNormLCP      = Number(document.getElementById("aveNormLCPInput").value);
  var sdNormLCP       = Number(document.getElementById("sdNormLCPInput").value);
  var aveIctalLCP     = Number(document.getElementById("aveIctalLCPInput").value);
  var sdIctalLCP      = Number(document.getElementById("sdIctalLCPInput").value);
  var node            = createNodeArray(numNodes,aveNormLCP,sdNormLCP,dataLength);

  network             = new createNetworkObject(iteration,completeNetwork,dataLength,timeStep,numNodes,gopDat,globalCoupParam,coupMatrix,node,aveConStrength,sdConStrength,aveOscFreq,sdOscFreq,aveNormLCP,sdNormLCP,aveIctalLCP,sdIctalLCP);

  return;
}

function getNetworkType(){
  //  Reads and returns the network type from the HTML form.

  var type;

  var typeRandom    = Boolean(document.getElementById('typeRandomInput').checked);
  var typeNeighbour = Boolean(document.getElementById("typeNearestNeighbourInput").checked);

  if (typeRandom === true){
    type = 0;
  }
  else if (typeNeighbour === true){
    type = 1;
  }

  if (type === undefined){
    alert("ERROR! Could not determine type of network to generate.");
  }

  return (type);
}

function createNodeArray(P,aveNormLCP,sdNormLCP,dataLength){
  //  Create and return the node array.

  var numIctal    = Number(document.getElementById("numIctalNodesInput").value);
  var aveNumOsc   = Number(document.getElementById("aveNumOscInput").value);
  var sdNumOsc    = Number(document.getElementById("sdNumOscInput").value);
  var aveOscFreq  = Number(document.getElementById("aveOscFreqInput").value);
  var sdOscFreq   = Number(document.getElementById("sdOscFreqInput").value);

  var ictalNodeList = generateIctalNodeArray(P,numIctal);
  var nodeArray=[];
  for (var q=0; q<P; q++){
    var colour          = getRainbowRandomColour(q,P);
    var isIctal         = ictalNodeList[q];
    var localCoupParam  = getNormalRandom(aveNormLCP,sdNormLCP);
    var numOsc          = Math.round(getNormalRandom(aveNumOsc,sdNumOsc));
    var phaseDat        = createArray(dataLength,0);
    var lopDat          = createArray(dataLength,0);
    var oscArray        = createOscArray(numOsc,aveOscFreq,sdOscFreq);

    var sum = new Complex(0,0);
    for (var m=0; m<numOsc; m++){
      sum = sum.add(Complex.exp(Complex(0,oscArray[m].phase)));
    }
    sum = sum.div(Complex(numOsc,0));
    lopDat[0]   = sum.abs();
    phaseDat[0] = sum.arg();
    if (phaseDat[0] < 0){
      phaseDat[0] += 2.0*Math.PI;
    }

    nodeArray.push(new createNodeObject(colour,isIctal,localCoupParam,numOsc,oscArray,lopDat,phaseDat));
  }

  return (nodeArray);
}

function generateIctalNodeArray(P,numIctal){
  //  Generate the list of ictal nodes.

  var ictalNodeList = [];

  var totalIctal = 0;
  for (var q=0; q<P; q++){
    ictalNodeList.push(false);
  }
  while (totalIctal != numIctal){
    q = Math.floor(getRandom(0,P));
    if (ictalNodeList[q] === false){
      totalIctal++;
      ictalNodeList[q] = true;
    }
  }

  return (ictalNodeList);
}

function createOscArray(N,aveFreq,sdFreq){
  //  Create an oscillator array.

  var oscArray = [];
  for (var m=0; m<N; m++){
    var freq  = getNormalRandom(aveFreq,sdFreq);
    var phase = getRandom(0.0,2.0*Math.PI);
    var x = Math.round(255*((freq - aveFreq + (2.0*sdFreq))/(4.0*sdFreq)));
    var colour= "rgba(" + String(x) + "," + String(0) + ","  + String(255-x) + "," + String(10.0/N) + ")";

    oscArray.push(new createOscillatorObject(colour,freq,phase));
  }

  return (oscArray);
}
