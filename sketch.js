"use strict";
let fuochi = [];
var i, x, y, c;
var lun = 75;

function setup() {
  createCanvas(600, 360);
}

function draw() {
  background(0);
  for (i = fuochi.length; --i >= 0;)
    fuochi[i].disegna();

  loadPixels();
  // disegno i punti equidistanti
  for (x = 0; x <= width; x++) {
    for (y = 0; y <= height; y++) {
      c = 0;
      for (i = fuochi.length; --i >= 0;)
        c += dist(x, y, fuochi[i].xx, fuochi[i].yy);
      if (c <= lun*pow(fuochi.length,1.5) + 2 && c >= lun*pow(fuochi.length,1.5) - 2 && fuochi.length != 0)
        set(x,y,color(255));
    }
  }
  updatePixels();
}

function mousePressed() {
  fuochi.push(new Fuoco(mouseX, mouseY));
}

class Fuoco {

  constructor(_x, _y) {
    this.xx = _x;
    this.yy = _y;
    this.r = 10;
  }

  disegna() {
    ellipse(this.xx, this.yy, this.r, this.r);
  }
}