var SPACE_BETWEEN_PIPES = 400
var PIPE_GAP_HEIGHT = 150

var brain = new Genome([ [1,1], [1,1,1,1], [1]])
brain.connect()
var myBird = new Bird(canvas.width/2,canvas.height/2,brain)

var flock = new Flock(1000)

var pipes = [new Pipe(300,PIPE_GAP_HEIGHT,800)]
var nextPipe = pipes[0]
var nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (myBird.x - Bird.RADIUS/2)
var score = 0;




var xDiff;
var yDiff;
var last;

function gameLoop(time){
  console.log(Flock.birds.length)
  if(last === undefined){
    last = time
  }
  dt = time - last;
  last = time
  //compute collisions
  for (bird in Flock.birds){
    var dead = false
    var thisBird = Flock.birds[bird]
    if(thisBird.x < 0){
      Flock.birds.splice(bird,1)
      continue
    }

    if(thisBird.dead){
      thisBird.step(dt)
      continue
    }

    var rect = nextPipe.topRect
    var rectX = rect.x + rect.width/2
    var rectY = rect.y + rect.height/2
    var rect2 = nextPipe.botRect
    var rectX2 = rect2.x + rect2.width/2
    var rectY2 = rect2.y + rect2.height/2
    if(rectangleCircleIntersects(rectX,rectY,rect.width,rect.height,thisBird.x,thisBird.y,thisBird.radius)){
      dead = true
    }
    if(rectangleCircleIntersects(rectX2,rectY2,rect2.width,rect2.height,thisBird.x,thisBird.y,thisBird.radius)){
      dead = true
    }
    if((thisBird.y + thisBird.radius)  >= canvas.height) dead = true

    if(dead){
      thisBird.setDead(true)
      thisBird.step(dt)
      continue
    } else {
      thisBird.step(dt)
    }

    var xDiff = (nextPipeDistance - 200) / (0 - 200) // scale data [0,1] aprox., 1 means very close, 0 means very far
    var yDiff = (Math.abs((nextPipe.topPipeHeight + PIPE_GAP_HEIGHT/2) - thisBird.y) - canvas.height/2/2) / (0 - canvas.height/2/2) // scale data [0,1] aprox., 1 means very close, 0 means very far
    //console.log(xDiff,yDiff)

    thisBird.brain.setNetworkInputs(xDiff,yDiff)
    var output = thisBird.brain.getNetworkOutputs()
    if(output >= 0.5){
      thisBird.jump()
    }
  }

  clearCanvas()

  //create new pipes
  if(pipes[pipes.length-1].x < (canvas.width-SPACE_BETWEEN_PIPES)){
    var random = randInRange(100,canvas.height-300)
    pipes.push(new Pipe(random,PIPE_GAP_HEIGHT,800))
  }


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

    var distFromBird = (pipes[i].x + Pipe.PIPE_WIDTH) - (canvas.width/2 - Bird.RADIUS/2)
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
  for (bird in Flock.birds){
    var thisBird = Flock.birds[bird]
    thisBird.draw()
  }
  window.requestAnimationFrame(gameLoop)
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
  for (bird in Flock.birds){
    var thisBird = Flock.birds[bird]
    thisBird.jump()
  }
})
