"use strict"; /* global SMALL,NETWORK_CREATION_ATTEMPT_LIMIT,NUM_KILL,getRandom,getNormalRandom,createMatrix,list,createArray: true */


//  -- Coupling Matrix Generation --
function generateCouplingMatrix(P,completeNetwork,networkType,aveStrength,sdStrength){
  //  Generate an appropriate coupling matrix.

  var aveCons     = Number(document.getElementById("aveNumNodeConnectionsInput").value);
  var sdCons      = Number(document.getElementById("sdNumNodeConnectionsInput").value);
  var twoWayCons  = Boolean(document.getElementById("twoWayConnectionsInput").checked);
  var postGenKills= Number(document.getElementById("postGenKillsInput").value);
  var matrix = createMatrix(P,P,SMALL);

  var attempts = 0;
  do {
    attempts += 1;
    matrix = createMatrix(P,P,SMALL);

    if (networkType === 0){
      createRandomCoupMatrix(aveCons,sdCons,aveStrength,sdStrength,matrix,P,twoWayCons);
    }
    else if (networkType == 1){
      createNeighbourCoupMatrix(aveCons,sdCons,aveStrength,sdStrength,matrix,P,twoWayCons);
    }
    cullConnections(matrix,P,postGenKills,twoWayCons);

    if (attempts > NETWORK_CREATION_ATTEMPT_LIMIT){
      alert("WARNING! Too many attempts to create appropriate network.");
      break;
    }
  } while (checkCompleteNetwork(matrix,0,P) != completeNetwork);

  console.log("Attempts to create network : ",attempts);

  return (matrix);
}

function createRandomCoupMatrix(aveCons,sdCons,aveStrength,sdStrength,matrix,P,twoWayCons){
  //  Creates random connections between the nodes.

  for (var q=0; q<P; q++){
    var newConnections = Math.round(getNormalRandom(aveCons,sdCons));
    var tried = createArray(P,false);
    while (newConnections > 0){
      var o = Math.floor(getRandom(0,P));
      if ((o != q) && (tried[o] === false)){
        var strength = getNormalRandom(aveStrength,sdStrength);
        matrix[q][o] = strength;
        if (twoWayCons === true){
          matrix[o][q] = strength;
        }
        newConnections--;
      }
      tried[o] = true;
    }
  }

  return;
}

function createNeighbourCoupMatrix(aveCons,sdCons,aveStrength,sdStrength,matrix,P,twoWayCons){
  //  Creates connections between neighbouring nodes.

  for (var q=0; q<P; q++){
    var numConnections = Math.round(getNormalRandom(aveCons,sdCons));
    for (var i=0; i<numConnections+1; i++){
      var o = q - Math.floor(numConnections/2) + i;
      if (q != o){
        if (o < 0){
          o += P;
        }
        else if (o >= P){
          o -= P;
        }
        var strength = getNormalRandom(aveStrength,sdStrength);
        matrix[q][o] = strength;
        if (twoWayCons === true){
          matrix[o][q] = strength;
        }
      }
    }
  }

  return;
}

function cullConnections(matrix,P,postGenKills,twoWayCons){
  //  Kill some connections after initial network generation.

  while (postGenKills > 0){
    var q = Math.floor(getRandom(0,P));
    var o = Math.floor(getRandom(0,P));
    if (matrix[q][o] > SMALL){
      matrix[q][o] = SMALL;
      if (twoWayCons == true){
        matrix[o][q] = SMALL;
      }
      postGenKills--;
    }
  }

  return;
}


function checkCompleteNetwork(matrix,v,P){
  //  Checks if a network is complete using the Depth First Search.

  //  Reset list of connected nodes.
  list = undefined;
  list = [];
  for (var q=0; q<P; q++){
    list.push(false);
  }

  //  Initiate DFS.
  depthFirstSearch(matrix,0,P);

  //  Check and return results
  for (var q=0; q<P; q++){
    if (list[q] === false){
      return (false);
    }
  }

  return (true);
}

function depthFirstSearch(matrix,v,P){
  //  If a node is connected to node v and has not been discovered, add it to the list.

  list[v] = true;

  for (var q=0; q<P; q++){
    if ((matrix[v][q] > SMALL) || (matrix[q][v] > SMALL)){
      if (list[q] === false){
        depthFirstSearch(matrix,q,P);
      }
    }
  }

  return;
}
