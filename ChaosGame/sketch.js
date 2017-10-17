var Polygon;
var poly;
var pointsPerFrame = 500;
var edges = 4;
var rules = [
  [0]
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  Polygon = function(edges, radius) {
    this.edges = edges;
    this.vertices = [];
    this.currentPoint = [0, 0];
    this.pastPoints = [];
    this.rules = [];
    this.init = function() {
      // fill vertices
      for (var i = 0; i < this.edges; i++) {
        var angle = -HALF_PI + TWO_PI / edges * i;
        var x = cos(angle) * radius;
        var y = sin(angle) * radius;
        this.vertices[i] = [x, y];
      }
      // put the curretn point inside the polygon at random place...
      //this.currentPoint = ???
      this.pastPoints.shift(this.currentPoint);
      // pick some rules
      var maxMemorySize = 4;
      var maxRulesPerGeneration = edges - 2; // sinon on reste bloqué ???
      var memorySize = Math.floor(Math.random() * (maxMemorySize + 1));
    }
    this.display = function() {
      push();
      stroke(0);
      noFill();
      translate(width / 2, height / 2);
      beginShape();
      for (var i = 0; i < this.edges; i++) {
        vertex(this.vertices[i][0], this.vertices[i][1]);
      }
      endShape(CLOSE);
      pop();
    }
    this.addPoints = function(n) {
      push();
      stroke(0, 50);
      translate(width / 2, height / 2);
      for (var i = 0; i < n; i++) {
        //pick a vertex according to the rules
        var pickedVertex;
        do {
          pickedVertex = this.vertices[Math.floor(Math.random() * this.edges)];
        } while ( this.checkRules(pickedVertex) );
        //
        this.pastPoints.shift(pickedVertex);
        //move the current point half the way to the picked vertex
        this.currentPoint[0] += (pickedVertex[0] - this.currentPoint[0]) / 2;
        this.currentPoint[1] += (pickedVertex[1] - this.currentPoint[1]) / 2;
        // draw it !
        point(this.currentPoint[0], this.currentPoint[1]);
      }
      pop();
    }
    this.setRules = function(rules) {
      this.rules = rules;
    }
    this.checkRules = function(p) {
      for (var i = 0; i < this.pastPoints.length; i++) {
        for (var j = 0; j < this.rules[i].length; j++) {
          if (this.rules[i][j] > -1 && p == (this.pastPoints[i] + this.rules[i][j]) % this.edges) {
            return true;
          }
        }
      }
      return false;
    }
  }
  poly = new Polygon(edges, 300);
  poly.init();
  poly.setRules(rules);
}

function draw() {
  poly.display();
  poly.addPoints(pointsPerFrame);
  fill(255);
  noStroke();
  rect(0, 0, 200, 50);
  fill(0);
  text("frame rate : " + frameRate().toFixed(2), 10, 20);
  text("points : " + frameCount * pointsPerFrame, 10, 30);
}
