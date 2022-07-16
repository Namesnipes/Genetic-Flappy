var SPACE_BETWEEN_PIPES = 400
var PIPE_GAP_HEIGHT = 150

var brain = new Genome([
    [1, 1],
    [1, 1, 1, 1, 1, 1],
    [1]
])

var flock = new Flock(1000)

var pipes = [new Pipe(300, PIPE_GAP_HEIGHT, 800)]
var nextPipe = pipes[0]
var nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (flock.birds[0] - Bird.RADIUS / 2)
var score = 0;




var xDiff;
var yDiff;
var last;

function gameLoop(time) {
    if (last === undefined) {
        last = time
    }
    dt = time - last;
    last = time

    //compute collisions and neural netwok output for each bird
    var allDead = true
    for (bird in flock.birds) {
        var dead = false
        var thisBird = flock.birds[bird]
        if (thisBird.x < 0) {
            thisBird.noDraw = true
            //Flock.birds.splice(bird,1)
            continue
        }
        if (thisBird.dead) {
            thisBird.step(dt)
            continue
        }

        dead = thisBird.shouldDie(nextPipe)

        if (dead) {
            console.log(thisBird.fitness)
            thisBird.setDead(true)
            thisBird.step(dt)
            continue
        } else {
            thisBird.step(dt)
        }
        allDead = false

        var fitness = (score * 100) + (600 - thisBird.distanceToPipe(nextPipe))
        thisBird.setFitness(fitness)

        var xDiff = (nextPipeDistance - 200) / (0 - 200) // scale data [-1,1] aprox., 1 means very close, 0 means very far
        var yDiff = ((nextPipe.topPipeHeight + PIPE_GAP_HEIGHT / 2 - thisBird.y) - canvas.height / 2 / 2) / (0 - canvas.height / 2 / 2) // scale data [0,1] aprox., 1 means very close, 0 means very far

        thisBird.brain.setNetworkInputs(xDiff, yDiff)
        var output = thisBird.brain.getNetworkOutputs()
        if (output >= 0.5) {
            thisBird.jump()
        }
    }

    clearCanvas()

    //create new pipes
    if (pipes[pipes.length - 1].x < (canvas.width - SPACE_BETWEEN_PIPES)) {
        var random = randInRange(100, canvas.height - 300)
        pipes.push(new Pipe(random, PIPE_GAP_HEIGHT, 800))
    }


    //give score, remove old pipes, set new next pipe
    var i = pipes.length
    var smallestDistance = 1000
    while (i--) {
        pipes[i].step(dt)
        if ((pipes[i].x + Pipe.PIPE_WIDTH / 2) <= (canvas.width / 2) && !pipes[i].scoredOn) { //score
            score++
            pipes[i].scoredOn = true
            document.getElementById("score").innerText = score
        }

        var distFromBird = (pipes[i].x + Pipe.PIPE_WIDTH) - (canvas.width / 2 - Bird.RADIUS / 2)
        if ((distFromBird > 0) && (distFromBird < smallestDistance)) {
            smallestDistance = distFromBird
            nextPipe = pipes[i]
            nextPipeDistance = distFromBird
        }

        if ((pipes[i].x + Pipe.PIPE_WIDTH) < 0) { //remove pipes
            Pipe.Rectangles.shift()
            Pipe.Rectangles.shift()
            pipes.splice(i, 1)
        }
    }

    //drawing time
    nextPipe.setColor("red")
    for (var i = 0; i < pipes.length; i++) {
        if (pipes[i] != nextPipe) pipes[i].setColor("black")
        pipes[i].draw(dt)
    }
    for (bird in flock.birds) {
        var thisBird = flock.birds[bird]
        if (!thisBird.noDraw) thisBird.draw()
    }
    if (!allDead){
      window.requestAnimationFrame(gameLoop)
    } else {
      reset()
    }
}

function reset() {
  console.log('r')
  flock = new Flock(1000)
  pipes = [new Pipe(300, PIPE_GAP_HEIGHT, 800)]
  nextPipe = pipes[0]
  nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (flock.birds[0] - Bird.RADIUS / 2)
  score = 0;

  window.requestAnimationFrame(gameLoop)
}


window.requestAnimationFrame(gameLoop)

document.getElementById("game").addEventListener('click', function(e) {
    for (bird in flock.birds) {
        var thisBird = flock.birds[bird]
        thisBird.jump()
    }
})
