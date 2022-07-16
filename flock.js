class Flock{
  constructor(population){
    this.birds = []
    for(var i = 0; i < population; i++){
      var brain = new Genome([ [1,1], [1,1,1,1,1,1], [1]])
      brain.connect()
      var bird = new Bird(canvas.width/2,canvas.height/2,brain)
      this.birds.push(bird)
    }
  }

  addBird(bird){
    this.birds.push(bird)
  }

}
