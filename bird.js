class Bird{
  static accel = 25
  constructor(x,y){
    this.x = x
    this.y = y
    this.radius = 10
    this.yVel = 0
  }

  setY(y){
    var newY = Math.max(0+this.radius, Math.min(y, canvas.width-this.radius));
    this.y = newY
  }

  draw(){
    drawDot(this.x,this.y,this.radius,'red')
  }

  step(msTime){
    var secTime = msTime/1000
    var newVelocity = this.yVel + Bird.accel * secTime
    var deltaY = this.yVel + 1/2 * Bird.accel * secTime ** 2
    this.setY(this.y + deltaY)
    this.yVel = newVelocity
  }

  jump(){
    this.yVel = -8
  }


}
