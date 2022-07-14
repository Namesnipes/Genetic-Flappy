var SPACE_BETWEEN_PIPES = 200
var PIPE_GAP_HEIGHT = 150

var myBird = new Bird(canvas.width/2,canvas.height/2)
var pipes = [new Pipe(300,PIPE_GAP_HEIGHT,800)]
var nextPipe = pipes[0]
var nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (myBird.x - Bird.RADIUS/2)
var score = 0;
var dead = false



var g = new Genome([ [1,1], [1,1,1,1], [1,1,1,1], [1]])
g.connect()
g.feedforward()
g.debugPrint()

var xDiff;
var yDiff;
var last;

function gameLoop(time){
  if(last === undefined){
    last = time
  }
  dt = time - last;
  last = time
  //compute collisions
  var rect = nextPipe.topRect
  var rectX = rect.x + rect.width/2
  var rectY = rect.y + rect.height/2
  var rect2 = nextPipe.botRect
  var rectX2 = rect2.x + rect2.width/2
  var rectY2 = rect2.y + rect2.height/2
  if(rectangleCircleIntersects(rectX,rectY,rect.width,rect.height,myBird.x,myBird.y,myBird.radius)){
    dead = true
  }
  if(rectangleCircleIntersects(rectX2,rectY2,rect2.width,rect2.height,myBird.x,myBird.y,myBird.radius)){
    dead = true
  }
  if((myBird.y + myBird.radius)  >= canvas.height) dead = true

  if(dead){
    return
  }

  var xDiff = nextPipeDistance
  var yDiff = Math.abs((nextPipe.topPipeHeight + PIPE_GAP_HEIGHT/2) - myBird.y)
  console.log(xDiff)

  clearCanvas()

  //create new pipes
  if(pipes[pipes.length-1].x < (canvas.width-SPACE_BETWEEN_PIPES)){
    var random = randInRange(100,canvas.height-300)
    pipes.push(new Pipe(random,PIPE_GAP_HEIGHT,800))
  }
  myBird.step(dt)


  //give score and remove old pipes
  var i = pipes.length
  var smallestDistance = 1000
  while(i--){
    pipes[i].step(dt)
    if((pipes[i].x + Pipe.PIPE_WIDTH/2) <= (canvas.width/2)  && !pipes[i].scoredOn){ //score
      score++
      pipes[i].scoredOn = true
      document.getElementById("score").innerText = score
    }

    var distFromBird = (pipes[i].x + Pipe.PIPE_WIDTH) - (myBird.x - Bird.RADIUS/2)
    if((distFromBird > 0) && (distFromBird < smallestDistance)){
      smallestDistance = distFromBird
      nextPipe = pipes[i]
      nextPipeDistance = distFromBird
    }

    if((pipes[i].x + Pipe.PIPE_WIDTH) < 0){ //remove pipes
      Pipe.Rectangles.shift()
      Pipe.Rectangles.shift()
      pipes.splice(i,1)
    }
  }

  //drawing time
  nextPipe.setColor("red")
  for(var i = 0; i < pipes.length; i++){
    if(pipes[i] != nextPipe) pipes[i].setColor("black")
    pipes[i].draw(dt)
  }
  myBird.draw()
  if(!dead){
    window.requestAnimationFrame(gameLoop)
  }
}

function reset(){
  document.getElementById("score").innerText = "0"
  score = 0;
  myBird = new Bird(canvas.width/2,canvas.height/2)
  dead = false
  Pipe.Rectangles = [];
  pipes = [new Pipe(300,200,800)]
}


window.requestAnimationFrame(gameLoop)

document.getElementById("game").addEventListener('click',function(e){
  myBird.jump()
})
