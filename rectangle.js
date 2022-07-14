class Rectangle{
  constructor(x,y,w,h){
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.color = "black"
  }
  setX(newX){
    this.x = newX
  }
  setY(newY){
    this.y = newY
  }
  setColor(color){
    this.color = color
  }
  draw(){
    drawRect(this.x,this.y,this.width,this.height,this.color)
  }
}
