// 4.669201609102990671853203820466201617258185577475768632745651343004134

var feigenbaum = 4.669201;
var mode = 0;


function setup() {
  createCanvas(1200, 600);
}

function draw() {
  switch (mode) {
    case 0:
      background(255, 50);
      stroke(0);
      noFill();
      var initVal = (frameCount * 0.00005) % 1;
      //var initVal = map(mouseY, 0, height, 0, 1);
      var index = Math.floor(map(mouseX, 0, width, 2, 14));
      beginShape();
      for (var x = 0; x < width; x++) {
        var growth = map(x, 0, width, 2., 4.);
        var points = logistic(initVal, growth, 15);
        curveVertex(x, (1 - points[index]) * height);
      }
      endShape();
      caption(initVal);
      break;
    case 1:
      background(255);
      stroke(0, 20);
      noFill();
      var points;
      var initVal;
      var index = Math.floor(map(mouseX, 0, width, 2, 14));
      for (var x = 0; x < width; x++) {
        var growth = map(x, 0, width, 2., 4.);
        initVal = points === undefined ? random(0, 1.) : points[199];
        points = logistic(initVal, growth, 200);
        for (var index = 0; index < 200; index += 0.5) {
          point(x, (1 - points[index]) * height);
        }
      }
      break;
  }
}

function logistic(init, growth, size) {
  var response = [];
  var x = response[0] = init * growth * (1 - init);
  for (var i = 1; i < size; i++) {
    x = response[i] = x * growth * (1 - x);
  }
  return response;
}

function mapLog(src, smin, smax, dmin, dmax) {
  var norm = (src - smin) / (smax - smin);
  return Math.log((norm * Math.LN2) + 1) / Math.log(feigenbaum) * (dmax - dmin) + dmin;
}

function caption(val) {
  fill(255, 255);
  noStroke();
  rect(0, 0, 200, 50);
  fill(0);
  text("init value : " + val.toFixed(5), 20, 20);
  text("frame rate : " + frameRate().toFixed(2), 20, 40);
}

function mouseClicked() {
  mode = (mode + 1) % 2;
}