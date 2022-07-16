//https://towardsdatascience.com/understanding-neural-networks-19020b758230
//https://github.com/Code-Bullet/Flappy-Bird-AI/blob/master/flappyBird/GENOME.JS

//https://towardsdatascience.com/using-genetic-algorithms-to-train-neural-networks-b5ffe0d51321
class Genome{
  constructor(structure){ //[ [1,1], [1,1,1,1], [1,1,1,1], [1]]
    this.layers = structure.length
    this.inputs = structure[0].length
    this.outputs = structure[0].length
    this.genome = []

    //inputs
    this.genome[0] = []
    for(var i = 0; i < structure[0].length; i++){
      var inputNode = new Node(0,i)
      inputNode.setOutput(1)
      this.genome[0].push(inputNode)
    }

    //hidden layers
    this.hiddenLayers = this.layers - 2
    for(var layerNum = 1; layerNum < (this.hiddenLayers + 1); layerNum++){
      this.genome[layerNum] = []
      for(var nodeNum = 0; nodeNum < structure[layerNum].length; nodeNum++){
        this.genome[layerNum].push(new Node(layerNum,nodeNum))
      }
    }

    //outputs
    this.genome[structure.length-1] = []
    for(var i = 0; i < structure[structure.length-1].length; i++){
      this.genome[structure.length-1].push(new Node(structure.length-1,i))
    }

  }

  connect(){ // create all the connections / weights
    for(var layerNum = 1; layerNum < this.genome.length; layerNum++){
      for(var nodeNum = 0; nodeNum < this.genome[layerNum].length; nodeNum++) {
        var currentConnections = []
        var toNode = this.genome[layerNum][nodeNum]
        for(var prevNodeNum = 0; prevNodeNum < this.genome[layerNum-1].length; prevNodeNum++){
          var fromNode = this.genome[layerNum-1][prevNodeNum]
          var weight = Math.random()-0.5//random_normal(); // make random
          currentConnections.push(new connectionNode(fromNode,toNode,weight))
        }
        toNode.setConnections(currentConnections)
      }
    }
  }

  getNetworkOutputs(){ //aka feedforward
    //console.log(this.genome[1][0].connections)
    //console.log(this.genome[1][0].getOutput())
    var finalOutputs = []
    for(var layerNum = 0; layerNum < this.genome.length; layerNum++){
      for(var nodeNum = 0; nodeNum < this.genome[layerNum].length; nodeNum++) {
        var out = this.genome[layerNum][nodeNum].getOutput()
        //console.log(out)
        if(layerNum === (this.genome.length-1)){
          finalOutputs.push(out)
        }
      }
    }
    return finalOutputs
  }

  setNetworkInputs(){
    var inputs = arguments //this is epic wow thanks stackoverflow
    for(var i = 0; i < this.genome[0].length; i++){
      this.genome[0][i].setOutput(inputs[i])
    }
  }

  debugPrint(){
    var str = ""
    for(var i = 0; i < this.genome.length; i++){
      if(i > 0){
        for(var k = 0; k < this.genome[i][0].connections.length; k++){
          str += "|" + this.genome[i][0].connections[k].weight + "|"
        }
        str += "\n"
      }
      for(var j = 0; j < this.genome[i].length; j++){
        str += "(" + this.genome[i][j].output + ")"
      }
      str += "\n"
    }
    console.log(str)
  }
}
