class Rectangle{
  constructor(x,y,w,h){
    this.x = x
    this.y = y
    this.width = w
    this.height = h
  }
  setX(newX){
    this.x = newX
  }
  setY(newY){
    this.y = newY
  }
  draw(){
    drawRect(this.x,this.y,this.width,this.height)
  }
}
