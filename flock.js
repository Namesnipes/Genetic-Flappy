class Flock{
  static birds = []
  constructor(population){
    for(var i = 0; i < population; i++){
      var brain = new Genome([ [1,1], [1,1,1,1], [1]])
      brain.connect()
      var bird = new Bird(canvas.width/2,canvas.height/2,brain)
      Flock.birds.push(bird)
    }
  }

}
