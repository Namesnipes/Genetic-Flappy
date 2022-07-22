class Flock{
  static Colors = ["rgba(255, 0, 0, 1)","rgba(0, 0, 255, 1)","rgba(0, 255, 0, 1)","rgba(0, 0, 0, 1)"]
  constructor(population,premadePopulation){
    if(!premadePopulation){
      this.birds = []
      for(var i = 0; i < population; i++){
        var brain = new Genome(Genome.BRAIN_STRUCTURE)
        brain.connect()
        var bird = new Bird(canvas.width/2,canvas.height/2,brain,Flock.Colors[Math.floor(Math.random()*Flock.Colors.length)])
        this.birds.push(bird)
      }
    } else {
      this.birds = premadePopulation
    }
  }

  addBird(bird){
    this.birds.push(bird)
  }

  pickAParent(){ //higher chance to pick a high fitnes parent
    var fitnessSum = 0
    for(var i = 0; i < this.birds.length; i++){
      fitnessSum += this.birds[i].fitness
    }

    var target = randInRange(0,fitnessSum)
    var runningSum = 0
    for(var i = 0; i < this.birds.length; i++){
      runningSum += this.birds[i].fitness
      if(runningSum > target){
        return this.birds[i]
      }
    }
  }




}
