var SPACE_BETWEEN_PIPES = 120
var PIPE_GAP_HEIGHT = 140
var POP_TOTAL = 500
var BIRDS_SURVIVE = 5
var TEST_BIRDS = 0

var fitnessHistory = []
var fitnessAvg = 0;

var brain = new Genome([
  [1, 1],
  [1, 1, 1, 1, 1, 1],
  [1]
])

var flock = new Flock(POP_TOTAL)


var myBird = new Bird(canvas.width / 2, canvas.height / 2, null, "yellow", true)
flock.addBird(myBird)

var pipes = [new Pipe(300, PIPE_GAP_HEIGHT, 800)]
var nextPipe = pipes[0]
var nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (flock.birds[0] - Bird.RADIUS / 2)
var nextNextPipe;
var nextNextPipeDistance;
var thirdNextPipe;
var thirdNextPipeDistance;

var score = 0;
var speed = 1;



var xDiff;
var yDiff;
var last;

function gameLoop(time) {
  if (last === undefined) {
    last = time
  }
  dt = (time - last).toFixed(2); //2 decimal precision
  last = time
  if (document.hidden) {
    window.requestAnimationFrame(gameLoop)
    return
  }

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
    if (isNaN(xDiff)) xDiff = -1.3
    var yDiff = ((nextPipe.topPipeHeight + (PIPE_GAP_HEIGHT / 2) - thisBird.y) - canvas.height / 2 / 2) / (0 - canvas.height / 2 / 2) // scale data [0,1] aprox., 1 means very close, 0 means very far
    var yDiff2 = 0
    var xDiff2 = -2
    var yDiff3 = 1
    var yVel = (thisBird.yVel - 0) / (400 - 0) // 1 is fast down, -1 is fast up
    if (nextNextPipe) {
      yDiff2 = ((nextNextPipe.topPipeHeight + (PIPE_GAP_HEIGHT / 2) - thisBird.y) - canvas.height / 2 / 2) / (0 - canvas.height / 2 / 2)
      xDiff2 = (nextNextPipeDistance - 200) / (0 - 200)
    }
    if (thirdNextPipe) yDiff3 = ((thirdNextPipe.topPipeHeight + PIPE_GAP_HEIGHT / 2 - thisBird.y) - canvas.height / 2 / 2) / (0 - canvas.height / 2 / 2)
    if (!thisBird.notNeural) {
      thisBird.brain.setNetworkInputs(xDiff, yDiff, yDiff2, xDiff2, yVel)
      var output = thisBird.brain.getNetworkOutputs()
      if (output >= 0.5) {
        thisBird.jump()
      }
    } else {}
  }

  clearCanvas()

  //create new pipes
  if (pipes[pipes.length - 1].x < (canvas.width - SPACE_BETWEEN_PIPES)) {
    var random = randInRange(250, canvas.height - 250)
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
      nextNextPipe = pipes[i + 1]
      thirdNextPipe = pipes[i + 2]

      nextPipeDistance = distFromBird
      if (nextNextPipe) {
        var distFromBird2 = (nextNextPipe.x + Pipe.PIPE_WIDTH) - (canvas.width / 2 - Bird.RADIUS / 2)
        nextNextPipeDistance = distFromBird2
      }
      if (thirdNextPipe) {
        var distFromBird2 = (thirdNextPipe.x + Pipe.PIPE_WIDTH) - (canvas.width / 2 - Bird.RADIUS / 2)
        thirdNextPipeDistance = distFromBird2
      }

    }

    if ((pipes[i].x + Pipe.PIPE_WIDTH) < 0) { //remove pipes
      Pipe.Rectangles.shift()
      Pipe.Rectangles.shift()
      pipes.splice(i, 1)
    }
  }
  //drawing time
  nextPipe.setColor("#fc2c21")
  if (nextNextPipe) {
    nextNextPipe.setColor("#fc574e")
  }
  if (thirdNextPipe) {
    thirdNextPipe.setColor("#fa948e")
  }
  for (var i = 0; i < pipes.length; i++) {
    if (pipes[i] != nextPipe && pipes[i] != nextNextPipe && pipes[i] != thirdNextPipe) pipes[i].setColor("black")
    pipes[i].draw(dt)
  }
  for (bird in flock.birds) {
    var thisBird = flock.birds[bird]
    if (!thisBird.noDraw) thisBird.draw()
  }
  if (!allDead) {
    window.requestAnimationFrame(gameLoop)
  } else {
    reset()
  }
}

function reset() {
  var rankedBirds = flock.birds
  rankedBirds.sort((a, b) => (a.fitness > b.fitness) ? -1 : 1)

  var babies = []
  for (var i = 0; i < POP_TOTAL - BIRDS_SURVIVE - TEST_BIRDS; i++) {
    var parent1 = flock.pickAParent()
    var parent2 = flock.pickAParent()
    babies.push(parent1.haveSex(parent2))
  }

  var fitnessSum = 0;
  for (var i = 0; i < flock.birds.length; i++) {
    fitnessSum += flock.birds[i].fitness

  }

  flock = new Flock(POP_TOTAL - BIRDS_SURVIVE - TEST_BIRDS, babies)
  for (var i = 0; i < BIRDS_SURVIVE; i++) {
    flock.addBird(new Bird(canvas.width / 2, canvas.height / 2, rankedBirds[i].brain.clone(), rankedBirds[i].color))
  }
  myBird = new Bird(canvas.width / 2, canvas.height / 2, null, "yellow", true, false)
  console.log(myBird.noDraw)
  flock.addBird(myBird)
  //var testBird = new Bird(canvas.width/2,canvas.height/2,rankedBirds[0].brain.clone(),"yellow",true)
  //testBird.brain.mutate()
  //flock.addBird(testBird)

  console.log(rankedBirds[0].fitness)
  console.log(flock.birds)



  pipes = [new Pipe(300, PIPE_GAP_HEIGHT, 800)]
  nextPipe = pipes[0]
  nextPipeDistance = (pipes[0].x + Pipe.PIPE_WIDTH) - (flock.birds[0] - Bird.RADIUS / 2)
  score = 0;

  fitnessHistory.push(Math.round(fitnessSum))
  var tempSum = 0;
  for (var i = fitnessHistory.length - 1; i > fitnessHistory.length - 10 && i >= 0; i--) {
    tempSum += fitnessHistory[i]
  }
  fitnessAvg = tempSum / 10;

  document.getElementById("fit").innerText = fitnessAvg
  document.getElementById("gen").innerText = Number(document.getElementById("gen").innerText) + 1
  xValues.push(Number(document.getElementById("gen").innerText))
  yValues.push(Math.round(fitnessSum))
  myChart.update()

  window.requestAnimationFrame(gameLoop)
}


window.requestAnimationFrame(gameLoop)

document.getElementById("preTrainButton1").addEventListener('click', function(e) {
  var biases = [
    [0, 0, 0, 0, 0],
    [-0.9193289504816624, -0.7524774865051748, 0.9160932709255538, 0.90267749426306],
    [0.6008774713796923, -0.8028856150474362, -0.09749813189527279, -0.6892673964110168],
    [-0.07171613722541414]
  ]

  var outWeights = [
    [
      [-0.752158807712024, 0.7488499008893867, -0.883769694440639, -0.5188776671263682],
      [0.936924520260672, -0.6219935765102176, -1.4924408769106448, -1.2013185176666383],
      [-1.2931348935563656, -0.24405401592216291, 0.48306358944869543, -0.24537066029523347],
      [0.07721395743240644, 0.3261514847153628, -0.06696589293390887, 0.49445636543339955],
      [0.6080142019472392, 0.0036601792691983714, -0.2921935348198389, 0.15586313371961258]
    ],

    [
      [-0.15778116702149925, -0.7130221836974883, -0.7210596031177499, -0.9283490876562741],
      [-0.9181075690637525, 0.8588897666168829, 0.5702655495667694, -0.05322633685456524],
      [-0.7605024592974465, -0.2489207292958049, -0.3856190943876694, 0.16280312877044378],
      [-0.8872516660273078, -0.4988473480994854, 0.9929665040797042, -0.19811189261348572]
    ],

    [
      [0.9640766795630944],[0.25401540401006495],[-0.8907608847918459],[-0.021774236831489713]
    ]
  ]

  var myBrain = new Genome([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1]
  ])
  myBrain.setBiases(biases)
  myBrain.setWeights(outWeights)
  var trainedBird = new Bird(canvas.width / 2, canvas.height / 2, myBrain, "#f2a11c", false, false)

  flock.addBird(trainedBird)
})

document.getElementById("speedSlider").oninput = function() {
  Flock.STEP_SPEED = this.value
  document.getElementById("speedLevel").textContent = this.value + "x"
}

document.getElementById("invisCheck").addEventListener("change", function(e) {
  if (event.currentTarget.checked) {
    flock.changeNoDraw(true)
  } else {
    flock.changeNoDraw(false)
  }
})

document.getElementById("game").addEventListener('click', function(e) {
  myBird.jump()
})
