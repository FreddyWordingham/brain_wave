"use strict";


//  == Object Creating Functions ==
//  -- Network Object --
function createNetworkObject(iteration,completeNetwork,dataLength,timeStep,numNodes,gopDat,globalCoupParam,coupMatrix,nodeArray,aveConStrength,sdConStrength,aveOscFreq,sdOscFreq,aveNormLCP,sdNormLCP,aveIctalLCP,sdIctalLCP){
  //  Creates the Network Object.

  this.iteration        = iteration;
  this.completeNetwork  = completeNetwork;
  this.dataLength       = dataLength;
  this.timeStep         = timeStep;
  this.numNodes         = numNodes;
  this.gopDat           = gopDat;
  this.globalCoupParam  = globalCoupParam;
  this.coupMatrix       = coupMatrix;
  this.node             = nodeArray;
  this.aveConStrength   = aveConStrength;
  this.sdConStrength    = sdConStrength;
  this.aveOscFreq       = aveOscFreq;
  this.sdOscFreq        = sdOscFreq;
  this.aveNormLCP       = aveNormLCP;
  this.sdNormLCP        = sdNormLCP;
  this.aveIctalLCP      = aveIctalLCP;
  this.sdIctalLCP       = sdIctalLCP;

  return;
}

//  -- Node Object --
function createNodeObject(colour,isIctal,localCoupParam,numOsc,oscArray,lopDat,phaseDat){
  //  Creates a Node object.

  this.colour           = colour;
  this.ictal            = isIctal;
  this.localCoupParam   = localCoupParam;
  this.numOsc           = numOsc;
  this.osc              = oscArray;
  this.lopDat           = lopDat;
  this.phaseDat         = phaseDat;

  return;
}

//  -- Oscillator Object --
function createOscillatorObject(colour,freq,phase){
  //  Creates an Oscillator object.

  this.colour = colour;
  this.freq   = freq;
  this.phase  = phase;

  return;
}
