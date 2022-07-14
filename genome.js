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

    console.log(structure)
  }

  connect(){ // create all the connections / weights
    for(var layerNum = 1; layerNum < this.genome.length; layerNum++){
      for(var nodeNum = 0; nodeNum < this.genome[layerNum].length; nodeNum++) {
        var currentConnections = []
        var toNode = this.genome[layerNum][nodeNum]
        for(var prevNodeNum = 0; prevNodeNum < this.genome[layerNum-1].length; prevNodeNum++){
          var fromNode = this.genome[layerNum-1][prevNodeNum]
          var weight = random_normal(); // make random
          currentConnections.push(new connectionNode(fromNode,toNode,weight))
        }
        toNode.setConnections(currentConnections)
      }
    }
    console.log(this.genome)
  }

  feedforward(){
    for(var layerNum = 0; layerNum < this.genome.length; layerNum++){
      for(var nodeNum = 0; nodeNum < this.genome[layerNum].length; nodeNum++) {
        var out = this.genome[layerNum][nodeNum].getOutput()
      }
    }
    console.log(this.genome)
  }

  debugPrint(){
    var str = ""
    for(var i = 0; i < this.genome.length; i++){
      for(var j = 0; j < this.genome[i].length; j++){
        str += "()"
      }
      str += "\n"
    }
    console.log(str)
  }
}
