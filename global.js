//  == Global Variables ==
//  -- Misc --
var currentInterval;
var SMALL = 1E-10;
var NETWORK_CREATION_ATTEMPT_LIMIT = 1000;
var NUM_KILL = 0;
var list;


//  -- Canvas --
var networkCanvas;
var nodeCanvas;
var knownCanvas;
var phaseCanvas;
var textCanvas;
var orderCanvas;
var inferedCanvas;

var networkCTX;
var nodeCTX;
var knownCTX;
var phaseCTX;
var textCTX;
var orderCTX;
var inferedCTX;


//  -- Simulation --
var network;
var selectedNode = 0;
var NODE_SLICES = 64;
