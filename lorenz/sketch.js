var pos = [-1., -1., 1.];
var sigma = 10.;
var beta = 2.666666;
var rho = 28.;
var dt = 0.002;
var points = 2500;
var still = false;
var rotateFlag = true;
var zoom = 8.;
var xrot = yrot = zrot = 0.;
var hertz;

function setup() {
  createCanvas(windowWidth, windowHeight);
  hertz = TWO_PI / 60;
}

function draw() {
  push();
  if (!still) {
    background(255);
    stroke(0);
  } else {
    stroke(0, 20);
  }
  noFill();
  translate(width / 2, height / 2);
  var positions = [];
  for (var i = 0; i < points; i++) {
    positions[i] = pos = lorenz(pos, dt);;
  }
  if (rotateFlag) {
      xrot += 0.5 * hertz;
      yrot += 0.7 * hertz;
      zrot += 0.3 * hertz;
  }
  /*
  for (i = 0; i < positions.length; i++) {
    positions[i][2] -= 30;
  }
  */
  for (i = 0; i < positions.length; i++) {
    positions[i] = rotator(positions[i], xrot, yrot, zrot);
  }
  /*
  for (i = 0; i < positions.length; i++) {
    positions[i][2] += 30;
  }
  */
  beginShape();
  for (i = 0; i < positions.length; i++) {
    var x, y;
    x = positions[i][0];
    y = positions[i][1];
    curveVertex(x * zoom, y * zoom);
  }
  endShape();
  pop();
  fill(255);
  noStroke(0);
  rect(0, 0, 200, 80);
  fill(0);
  text("Click for butterfly effect", 20, 20);
  text("frame rate : " + frameRate().toFixed(), 20, 40);
}

function lorenz(vec, dt) {
  var x, y, z, dx, dy, dz;
  x = vec[0];
  y = vec[1];
  z = vec[2];
  dx = sigma * (y - x);
  dy = x * (rho - z) - y;
  dz = (x * y) - (beta * z); 
  dx *= dt;
  dy *= dt;
  dz *= dt;
  x += dx;
  y += dy;
  z += dz;
  return [x, y, z];
}

function rotator(pos, xrot, yrot, zrot) {
  var rx, ry, rz, tx, ty, tz;
  rx = pos[0];
  ry = pos[1];
  rz = pos[2];

  // plan z
  tx = rx * cos(zrot) - ry * sin(zrot);
  ty = rx * sin(zrot) + ry * cos(zrot);
  tz = rz;
  rx = tx;
  ry = ty;
  rz = tz;

  // plan y
  tx = rx * cos(yrot) + rz * sin(yrot);
  ty = ry;
  tz = -rx * sin(yrot) + rz * cos(yrot);
  rx = tx;
  ry = ty;
  rz = tz;

  // plan x
  tx = rx;
  ty = ry * cos(xrot) - rz * sin(xrot);
  tz = ry * sin(xrot) + rz * cos(xrot);
  rx = tx;
  ry = ty;
  rz = tz;

  return [rx, ry, rz];
}

function mouseClicked() {
  still = !still;
  rotateFlag = !rotateFlag;
  background(255);
}
