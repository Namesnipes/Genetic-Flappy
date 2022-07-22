class Bird{
  static accel = 25
  static RADIUS = 10
  constructor(x,y,brain,color,notNeural,noDraw=Flock.noDraw){
    this.notNeural = notNeural
    this.brain = brain
    this.fitness = 0
    this.dead = false
    this.noDraw = noDraw
    this.color = color
    this.x = x
    this.y = y
    this.radius = Bird.RADIUS
    this.yVel = 0
  }

  setDead(isDead){
    this.dead = isDead
    this.yVel = 0
  }
  setY(y){
    var newY = Math.max(0+this.radius, Math.min(y, canvas.width-this.radius));
    this.y = newY
  }

  setX(x){
    this.x = newX
  }

  setFitness(fitness){
    if(this.notNeural) this.fitness = 0;
    else this.fitness = fitness
  }

  shouldDie(pipe){
    var collides = false
    var rect = pipe.topRect
    var rectX = rect.x + rect.width/2
    var rectY = rect.y + rect.height/2
    var rect2 = pipe.botRect
    var rectX2 = rect2.x + rect2.width/2
    var rectY2 = rect2.y + rect2.height/2
    if(rectangleCircleIntersects(rectX,rectY,rect.width,rect.height,this.x,this.y,this.radius)){
      collides = true
    }
    if(rectangleCircleIntersects(rectX2,rectY2,rect2.width,rect2.height,this.x,this.y,this.radius)){
      collides = true
    }
    if((this.y + this.radius)  >= canvas.height) collides = true

    return collides
  }

  distanceToPipe(pipe){
    var x1 = this.x
    var y1 = this.y

    var x2 = (pipe.x + Pipe.PIPE_WIDTH)
    var y2 = pipe.topPipeHeight + PIPE_GAP_HEIGHT/2

    var a = x2 - x1
    var b = y2 - y1

    var c = Math.sqrt(a**2 + b**2)

    return c
  }

  haveSex(parent){
    var babyBrain = this.brain.crossover(parent.brain)
    babyBrain.mutate()
    var baby = new Bird(canvas.width/2,canvas.height/2,babyBrain,this.color)
    return baby
  }

  draw(){
    drawDot(this.x,this.y,this.radius,this.color)
  }

  step(msTime){
    var secTime = msTime/1000
    if(!this.dead){
      var newVelocity = this.yVel + Bird.accel * secTime
      var deltaY = this.yVel + 1/2 * Bird.accel * secTime ** 2
      this.setY(this.y + deltaY)
      this.yVel = newVelocity
    } else {
      var offset = Pipe.movementSpeed * secTime
      this.x -= offset
    }
  }

  jump(){
    if(!this.dead){this.yVel = -8} else { console.log("what")}
  }


}
