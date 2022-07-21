//https://towardsdatascience.com/understanding-neural-networks-19020b758230
//https://github.com/Code-Bullet/Flappy-Bird-AI/blob/master/flappyBird/GENOME.JS

//https://towardsdatascience.com/using-genetic-algorithms-to-train-neural-networks-b5ffe0d51321
class Genome{
  static MUTATION_RATE = 0.3
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

  connect(weights){ // create all the connections / weights
    for(var layerNum = 1; layerNum < this.genome.length; layerNum++){
      for(var nodeNum = 0; nodeNum < this.genome[layerNum].length; nodeNum++) {
        var currentConnections = []
        var toNode = this.genome[layerNum][nodeNum]
        for(var prevNodeNum = 0; prevNodeNum < this.genome[layerNum-1].length; prevNodeNum++){
          var fromNode = this.genome[layerNum-1][prevNodeNum]
          var weight;
          if(weights) weight = weights[layerNum][nodeNum].inConnections[prevNodeNum].weight
          else weight = Math.random()-0.5//random_normal(); // make random
          var connectingNode = new connectionNode(fromNode,toNode,weight)
          fromNode.addOutConnections(connectingNode)
          currentConnections.push(connectingNode)
        }
        toNode.setInConnections(currentConnections)
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


  //Swaps all weights of a random neuron with brain2
  crossover(brain2){
    var hiddenLayers = this.layers-2

    var randomLayer = getRandomInt(0,hiddenLayers-1)+1
    var numberOfNodes = this.genome[randomLayer].length;

    var randomNode = getRandomInt(0,numberOfNodes-1)

    var node1 = this.genome[randomLayer][randomNode]
    var node2 = brain2.genome[randomLayer][randomNode]


    var babyBrain = this.clone()
    for(var i = 0; i < babyBrain.genome[randomLayer][randomNode].inConnections.length; i++){
      babyBrain.genome[randomLayer][randomNode].inConnections[i].weight = node2.inConnections[i].weight
    }
    for(var i = 0; i < babyBrain.genome[randomLayer][randomNode].outConnections.length; i++){
      babyBrain.genome[randomLayer][randomNode].outConnections[i].weight = node2.outConnections[i].weight
    }

    return babyBrain
  }

  mutate(){
    if(Math.random() < Genome.MUTATION_RATE){
      console.log('mutate')
      var multiplier = randInRange(0.5,1.5)
      var randomLayer = getRandomInt(0,this.layers-1)
      var numberOfNodes = this.genome[randomLayer].length;

      var randomNode = getRandomInt(0,numberOfNodes-1)
      var node = this.genome[randomLayer][randomNode]
      var weight;
      if(node.layer === 0){
        node["outConnections"][getRandomInt(0,this.genome[1].length-1)].weight *= multiplier
      } else if(node.layer === this.layers-1){
        node["inConnections"][getRandomInt(0,this.genome[this.layers-2].length-1)].weight *= multiplier
      } else {
        node["inConnections"][getRandomInt(0,this.genome[randomLayer-1].length-1)].weight *= multiplier
        node["outConnections"][getRandomInt(0,this.genome[randomLayer+1].length-1)].weight *= multiplier
      }
    } else {

    }

  }

  clone(){
    var g = new Genome(this.genome)
    g.connect(this.genome)

    return g
  }

  debugPrint(){
    var str = ""
    for(var i = 0; i < this.genome.length; i++){
      if(i > 0){
        for(var k = 0; k < this.genome[i][0].inConnections.length; k++){
          str += "|" + this.genome[i][0].inConnections[k].weight + "|"
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
