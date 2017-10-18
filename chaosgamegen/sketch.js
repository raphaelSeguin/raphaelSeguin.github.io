var fr;
var cg;
var pointsPerFrame = 1000;
var edges = 6;
var rules = [
  [1], [], [0]
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(1);
  init();
  pixelDensity(2.0);
}

function draw() {
  push();
  translate(width / 2, height / 2);
  cg.displayPolygon(height / 2 - 20);
  cg.addPoints(pointsPerFrame, height / 2 - 20);
  pop();
  caption();
}

function caption() {
  fill(255);
  noStroke();
  rect(0, 0, 200, 70);
  fill(0);
  fr = frameCount % 20 === 1 ? frameRate().toFixed(0) : fr;
  text("Click to generate new shape", 20, 20);
  text("frame rate : " + fr, 20, 40);
  text("points : " + cg.getNumberOfPoints(), 20, 60);
}

function mouseReleased() {
  init();
  cg.getRules();
  background(255);
}

function createChaosGame(edges) {
  // objet chaosGame;
  var chaosGame = {};
  // edges : nombres de faces
  chaosGame.edges = edges;
  // vertices : coordonnées des sommets (-1, 1)
  chaosGame.vertices = [];
  // premier point [0, 0] // éventuellement à tirer au sort ...
  chaosGame.currentPoint = [0., 0.];
  // nombre de points ajoutés
  chaosGame.numberOfPoints = 0;
  // les regles ...
  chaosGame.rules = [];
  // mémoire
  chaosGame.pastVertexNumbers = [];
  // remplis le tableau chaosGame.vertices
  for (var i = 0; i < edges; i++) {
    var angle = -HALF_PI + TWO_PI / edges * i;
    var x = cos(angle);
    var y = sin(angle);
    chaosGame.vertices[i] = [x, y];
  }
  // methode d'affichage du polygone
  chaosGame.displayPolygon = function(radius) {
    push();
    stroke(245);
    noFill();
    beginShape();
    for (var i = 0; i < this.edges; i++) {
      vertex(chaosGame.vertices[i][0] * radius, chaosGame.vertices[i][1] * radius);
    }
    endShape(CLOSE);
    pop();
  }
  chaosGame.addPoints = function(n, radius) {
    push();
    stroke(0, 50);
    for (var i = 0; i < n; i++) {
      //pick a vertex according to the rules
      var pickedVertex, vertexNumber;
      do {
        vertexNumber = Math.floor(Math.random() * chaosGame.edges);
      } while (chaosGame.checkRules(vertexNumber));
      pickedVertex = chaosGame.vertices[vertexNumber];
      chaosGame.pastVertexNumbers.unshift(vertexNumber);
      chaosGame.pastVertexNumbers.pop(chaosGame.rules.length);
      chaosGame.currentPoint[0] += (pickedVertex[0] - chaosGame.currentPoint[0]) / 2;
      chaosGame.currentPoint[1] += (pickedVertex[1] - chaosGame.currentPoint[1]) / 2;
      point(chaosGame.currentPoint[0] * radius, chaosGame.currentPoint[1] * radius);
    }
    pop();
    chaosGame.numberOfPoints += n;
  }
  chaosGame.checkRules = function(n) {
    for (var i = 0; i < chaosGame.pastVertexNumbers.length; i++) {
      for (var j = 0; j < chaosGame.rules[i].length; j++) {
        if (n === (chaosGame.pastVertexNumbers[i] + chaosGame.rules[i][j]) % chaosGame.edges) {
          return true;
        }
      }
    }
    return false;
  }
  chaosGame.setRules = function(rules) {
    chaosGame.rules = rules;
    // remplis le tabeau de mémoire
    for (var i = 0; i < chaosGame.rules.length; i++) {
      chaosGame.pastVertexNumbers.push(-1);
    }
  }
  chaosGame.setRandomRules = function(depth) {
    var rndRules = [];
    var depth = floor(random(chaosGame.edges/2));
    console.log("depth : " + depth);
    for (var i = 0; i < depth; i++) {
      var constraints = floor(random(chaosGame.edges - 2));
      rndRules.push(among(constraints, chaosGame.edges -1))
    }
    chaosGame.setRules(rndRules);
  }
  chaosGame.getRules = function() {
    var res = "";
    res += "[ ";
    for (var i = 0; i < chaosGame.rules.length; i++) {
      for (var j = 0; j < chaosGame.rules[i].length; j++) {
        if (j === 0) {
          res += "[";
        }
        res += chaosGame.rules[i][j]
        if (j < chaosGame.rules[i].length - 1) {
          res += ", "
        };
        if (j === chaosGame.rules[i].length - 1) {
          if (i < chaosGame.rules.length - 1) {
            res += "], ";
          } else {
            res += "]";
          }
        }
      }
    }
    res += " ]";
    console.log(res);
  }
  chaosGame.getNumberOfPoints = function() {
    return chaosGame.numberOfPoints;
  }
  return chaosGame;
}

function among(n, total) {
  var res = [];
  var pick;
  for (var i = 0; i < n; i++) {
    do {
      pick = floor(random(total))
    } while (res.indexOf(pick) > -1);
    res.push(pick);
  }
  return res;
}

function init() {
  console.log("INIT");
  cg = createChaosGame(floor(random(6, 9)));
  cg.setRandomRules();
  cg.getRules();
  frameCount = 0;
}
