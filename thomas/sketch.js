var pos = [0.1, 0.2, 0.3];
var b = 0.2;
var dt = 0.005;
var points = 2000;
var still = false;
var rotateFlag = true;
var zoom = 40.;
var xrot = yrot = zrot = 0;
var hertz;


function setup() {
  createCanvas(windowWidth, windowHeight);
  hertz = TWO_PI / 60000;
}

function draw() {
  if (!still) {
    b = map(mouseX, 0, width, 0.001, 0.25);
    dt = map(mouseY, 0, height, 0.001, 0.5);
    background(255);
    stroke(255, 0, 0);
  } else {
    stroke(255, 0, 0, 30);
  }

  noFill();
  translate(width / 2, height / 2);
  var positions = [];
  for (var i = 0; i < points; i++) {
    pos = thomas(pos, b, dt);
    positions[i] = pos;
  }
  for (i = 0; i < positions.length; i++) {
    if (rotateFlag) {
      xrot += 0.1 * hertz;
      yrot += 0.07 * hertz;
      zrot += 0.03 * hertz;
    }
    positions[i] = rotator(positions[i], xrot, yrot, zrot);
  }
  beginShape();
  for (i = 0; i < positions.length; i++) {
    var x, y;
    x = positions[i][0];
    y = positions[i][1];
    curveVertex(x * zoom, y * zoom);
  }
  endShape();
}

function thomas(vec, b, dt) {
  var x, y, z, dx, dy, dz;
  dx = sin(vec[1]) - b * vec[0];
  dy = sin(vec[2]) - b * vec[1];
  dz = sin(vec[0]) - b * vec[2];
  dx *= dt;
  dy *= dt;
  dz *= dt;
  x = vec[0] + dx;
  y = vec[1] + dy;
  z = vec[2] + dz;
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
  background(255);
}

function keyPressed() {
  if (key === ' ') {
    rotateFlag = !rotateFlag;
  }
}
