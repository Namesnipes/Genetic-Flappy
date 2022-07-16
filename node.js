//https://i.imgur.com/afONPGv.png
//https://i.imgur.com/IuPtcoe.png
class Node{

  constructor(layer,number){
    this.layer = layer
    this.number = number

    this.bias = 0;
    this.input = null
    this.output = null
    this.connections = null
  }

  sigmoid(x){
    return 1/(1+Math.pow(Math.E,-x))
  }

  getOutput(){
    if(this.layer == 0) return;

    var output = 0
    for(var i = 0; i < this.connections.length; i++){
      output += this.connections[i].weight * this.connections[i].from.output
      //console.log(this.number, this.connections[i],"*", this.connections[i].from.output)
    }
    output += this.bias
    //Output = W1*In1 + W2*In2 + W3*In3 + W4*In4 + W5*In5 + Bias_Neuron1
    var activation = this.sigmoid(output)
    this.output = activation
    return activation
  }
  setInput(input){
    this.input = input
  }
  setOutput(output){
    this.output = output
  }
  setConnections(connections){
    this.connections = connections
  }

}
