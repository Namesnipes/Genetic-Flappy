var canvas = document.getElementById("game")
var context = canvas.getContext("2d");

function drawDot(x,y,radius,color='black'){
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color
  context.fill()
  context.stroke();
}

function drawRect(x,y,width,height,color='black'){
  context.beginPath();
  context.rect(x, y, width, height);
  context.fillStyle = color
  context.fill()
  context.stroke
}

function rectangleCircleIntersects(rX,rY,rW,rH,cX,cY,cR){ // coordinates are from the middle
  var xDistance = Math.abs(cX - rX)
  var yDistance = Math.abs(cY - rY)

  if(xDistance > (rW/2 + cR)) return false;
  if(yDistance > (rH/2 + cR)) return false;

  if (xDistance <= (rW/2)) return true;
  if (yDistance <= (rH/2)) return true;

  var cornerDistance = (xDistance - rW/2)**2 + (yDistance - rH/2)**2

  return cornerDistance <= cR^2
}

function randInRange(min,max){
  return Math.random() * (max - min) + min
}

function clearCanvas(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}
