"use strict"; /* global currentInterval: true */


//  == Simulation Functions ==
//  -- Control Function --
function initialiseSim(){
  //  Call functions to initiate the simulation.

  var timeStep  = Number(document.getElementById("timeStepInput").value);
  var simSpeed  = Number(document.getElementById("simSpeedInput").value);
  var intervalPeriod  = Math.round((1000*timeStep)/simSpeed);

  if (currentInterval === undefined){
    currentInterval = setInterval(function(){network.iteration = iterate(network.iteration);},intervalPeriod);
  }
  else {
    currentInterval = clearInterval(currentInterval);
  }

  return;
}

//  -- Iteration Functions --
function iterate(iteration){
  //  Iterate the simulation forward one time step.

  bumpData();


    var P = network.numNodes;
    var dt = network.timeStep;
    var C = network.globalCoupParam;

    //  Update osc phases.
    for (var q=0; q<P; q++){
      var N = network.node[q].numOsc;
      var ksi = network.node[q].phaseDat[1];
      var r = network.node[q].lopDat[1];
      var K = network.node[q].localCoupParam;
      for (var m=0; m<N; m++){
        var phase = network.node[q].osc[m].phase;
        var dTheta = network.node[q].osc[m].freq;
        dTheta += r * K * Math.sin(ksi - phase);
        for (var o=0; o<P; o++){
          dTheta += C * network.node[o].lopDat[1] * network.coupMatrix[q][o] * Math.sin(network.node[o].phaseDat[1] - phase);
        }
        dTheta = dTheta * dt;
        network.node[q].osc[m].phase += dTheta;
        if (network.node[q].osc[m].phase >= (2.0*Math.PI)){
          network.node[q].osc[m].phase -= (2.0*Math.PI);
        }
        else if (network.node[q].osc[m].phase < 0.0){
          network.node[q].osc[m].phase += 2.0*Math.PI;
        }

      }
    }


    //  Update ave node freqs
    for (var q=0; q<P; q++){
      var N = network.node[q].numOsc;
      var x = 0;
      var y = 0;
      for (var m=0; m<N; m++){
        x += Math.sin(network.node[q].osc[m].phase);
        y += Math.cos(network.node[q].osc[m].phase);
      }
      x = x / N;
      y = y / N;
      network.node[q].phaseDat[0] = Math.atan2(x,y);
    }
  /*
    //  Update local order parameters
    for (var q=0; q<P; q++){
      var r = network.node[q].lopDat[1];
      var K = network.node[q].localCoupParam;
      var x = r * K;
      for (var o=0; o<P; o++){
        x += C * network.node[o].lopDat[1] * network.coupMatrix[q][o];
      }
      network.node[q].lopDat[0] = (Math.sqrt(Math.PI)/2.0) * x * Math.exp(-0.5*x*x) * (BesselI0(0.5*x*x) + BesselI1(0.5*x*x));
    }

    //  Update global order parameter.
    var globalOrderParam = 0.0;
    for (var q=0; q<P; q++){
      globalOrderParam += network.node[q].lopDat[0] * (0.5 * (Math.cos(network.node[q].phaseDat[0]) + 1.0));    // May need to change this too.
    }
    globalOrderParam = globalOrderParam / P;
    network.gopDat[0] = globalOrderParam;
    */


    network.gopDat[0] = 0.0;
    for (var q=0; q<P; q++){
      var N = network.node[q].numOsc;
      var x = 0;
      var y = 0;
      for (var m=0; m<N; m++){
        var phase = network.node[q].osc[m].phase;
        x += Math.sin(phase);
        y += Math.cos(phase);
      }
      var r = (1.0/N) * Math.sqrt((x*x)+(y*y));
      network.node[q].lopDat[0] = r;
      network.gopDat[0] += r;
    }
    network.gopDat[0] = network.gopDat[0] / P;



  drawAll();

  return (network.iteration+1);
}

function bumpData(){
  //  Bump data along the arrays.

  var A = network.dataLength;
  var P = network.numNodes;

  for (var q=0; q<P; q++){
    for (var i=A; i>0; i--){
      network.node[q].phaseDat[i] = network.node[q].phaseDat[i-1];
      network.node[q].lopDat[i] = network.node[q].lopDat[i-1];
    }
  }
  for (var i=A; i>0; i--){
    network.gopDat[i] = network.gopDat[i-1];
  }

  return;
}
