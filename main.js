$(document).ready(function(){
  "use strict";


  //  == Triggered Functions ==
  // Opens the control panel.
  $("#menuButton").click(function(){
    $("#controlPanel").slideToggle("slow","swing");
  });

  //  Generates a new network.
  $("#generateButton").click(function(){
    initCanvasVariables();
    createNewNetwork();
    drawAll();
  });

  //  Runs the simulation.
  $("#simulateButton").click(function(){
    initialiseSim();
  });

  function initCanvasVariables(){
    // Initialise the canvas variables.

    networkCanvas = document.getElementById("networkCanvas");
    nodeCanvas    = document.getElementById("nodeCanvas");
    knownCanvas   = document.getElementById("knownCanvas");
    phaseCanvas   = document.getElementById("phaseCanvas");
    textCanvas    = document.getElementById("textCanvas");
    orderCanvas   = document.getElementById("orderCanvas");
    inferedCanvas = document.getElementById("inferedCanvas");
    networkCTX    = networkCanvas.getContext("2d");
    nodeCTX       = nodeCanvas.getContext("2d");
    knownCTX      = knownCanvas.getContext("2d");
    phaseCTX      = phaseCanvas.getContext("2d");
    textCTX       = textCanvas.getContext("2d");
    orderCTX      = orderCanvas.getContext("2d");
    inferedCTX    = inferedCanvas.getContext("2d");

    return;
  }

  document.onkeypress = function (e) {

    var keynum = e.keycode;
    if(window.event) { // IE
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera
      keynum = e.which;
    }
    var key = Number(keynum);

    if (key == 97){
      selectedNode--;
      if (selectedNode < 0){
        selectedNode = network.numNodes-1;
      }
    }
    else if (key == 100){
      selectedNode++;
      if (selectedNode >= network.numNodes){
        selectedNode = 0;
      }
    }
    else{
      console.log("Unknown key: ",key);
    }

    drawAll();
  };

  initCanvasVariables();
  createNewNetwork();
  drawAll();
  initialiseSim();
});
