class Pipe{
  static Rectangles = [];
  static movementSpeed = 100 // pixels / sec
  static PIPE_WIDTH = 50

  constructor(topPipeHeight,gapHeight,x){
    this.topPipeHeight = topPipeHeight
    this.gapHeight = gapHeight
    this.topRect = new Rectangle(x,0,Pipe.PIPE_WIDTH,topPipeHeight)
    this.botRect = new Rectangle(x,topPipeHeight+gapHeight,Pipe.PIPE_WIDTH,canvas.height)
    this.x = x
    this.scoredOn = false
    Pipe.Rectangles.push(this.topRect)
    Pipe.Rectangles.push(this.botRect)
  }

  draw(){
    this.topRect.draw()
    this.botRect.draw()
  }

  setColor(color){
    this.topRect.setColor(color)
    this.botRect.setColor(color)
  }

  step(dt){
    var offset = Pipe.movementSpeed * dt/1000
    this.x -= offset
    this.topRect.setX(this.topRect.x - offset)
    this.botRect.setX(this.botRect.x - offset)
    //this.x -= Pipe.movementSpeed * dt/1000
  }

}
