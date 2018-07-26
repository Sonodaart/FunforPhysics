var circle = {
  x: 0,
  y: 0,
  r: 20
};

function setup() {
  createCanvas(700, 400);
}

function draw() {
  background(map(mouseX, 0, 700, 0, 255), 0, map(mouseY, 0, 400, 0, 255));
  ellipse(mouseX, mouseY, circle.r, circle.r);
  //circle.x++;
  //circle.y++;
}