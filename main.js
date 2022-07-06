var myBird = new Bird(canvas.width/2,canvas.height/2)
var pipes = [new Pipe(300,200,800)]
var score = 0;
var dead = false

var SPACE_BETWEEN_PIPES = 200

var last;
function gameLoop(time){
  if(last === undefined){
    last = time
  }
  dt = time - last;
  last = time

  //compute collisions
  for(var i = 0; i < Pipe.Rectangles.length; i++){
    var rect = Pipe.Rectangles[i]
    var rectX = rect.x + rect.width/2
    var rectY = rect.y + rect.height/2
    if(rectangleCircleIntersects(rectX,rectY,rect.width,rect.height,myBird.x,myBird.y,myBird.radius)){
      dead = true
      break;
    }
  }

  if((myBird.y + myBird.radius)  >= canvas.height) dead = true

  clearCanvas()

  if (dead) {
    reset()
    score = 0;
  }

  //create new pipes
  if(pipes[pipes.length-1].x < (canvas.width-SPACE_BETWEEN_PIPES)){
    var random = randInRange(100,canvas.height-300)
    pipes.push(new Pipe(random,200,800))
  }
  myBird.step(dt)

  //give score and remote old pipes
  var i = pipes.length
  while(i--){
    pipes[i].step(dt)
    pipes[i].draw(dt)
    if((pipes[i].x + 25) <= (canvas.width/2)  && !pipes[i].scoredOn){ //score
      score++
      pipes[i].scoredOn = true
      console.log(score)
    }
    if((pipes[i].x + 50) < 0){ //remove pipes
      Pipe.Rectangles.shift()
      Pipe.Rectangles.shift()
      pipes.splice(i,1)
    }
  }

  myBird.draw()
  window.requestAnimationFrame(gameLoop)
}

function reset(){
  myBird = new Bird(canvas.width/2,canvas.height/2)
  dead = false
  Pipe.Rectangles = [];
  pipes = [new Pipe(300,200,800)]
}


window.requestAnimationFrame(gameLoop)

document.getElementById("game").addEventListener('click',function(e){
  myBird.jump()
})
