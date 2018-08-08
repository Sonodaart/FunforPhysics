/*
  PROGRAMMA DI SCACCHI
  
  Ancora da implementare:
      -AI
  
  Mosse speciali mancanti:
      -Arrocchi
      -En passant

*/

"use strict";
var x, y, i, l, k, j, z, q, a, aa, caso1, caso2, f, ff, broken, mossa, inCheck, currentSelectedX, currentSelectedY, oldSelectedX, oldSelectedY;
var sss, ttt, iii, sos, xxx, yyy, rk1, rk2, op1, op2, bv;
var nomePezzoEliminato, nomePezzoEliminatoX, nomePezzoEliminatoY, b, isOneDeleted, nomePezzoEliminatoIndexImage;
var checkMate = "none";
var turno = "w";
currentSelectedX = currentSelectedY = oldSelectedX = oldSelectedY = 9;
l = 64;
var c = 0;
var col = false;
var indexChosen;
// indici dna
var p, o, m, v, t, g, cont, saveX, saveY, eatedX, eatedY, Hindex, Hscore, eatedIndex;

let pezziNeri = [];
let pezziBianchi = [];
let caselle = [];
let imgpezzo = [];

let mosseDisponibiliNero = [];
let mosseDisponibiliBianco = [];
let copyArray = [];

let Alice, Bob;
var reader;

function preload() {
  // black
  imgpezzo.push(loadImage("Images/black_pawn.png"));
  imgpezzo.push(loadImage("Images/black_bishoop.png"));
  imgpezzo.push(loadImage("Images/black_knight.png"));
  imgpezzo.push(loadImage("Images/black_rook.png"));
  imgpezzo.push(loadImage("Images/black_queen.png"));
  imgpezzo.push(loadImage("Images/black_king.png"));
  // white
  imgpezzo.push(loadImage("Images/white_pawn.png"));
  imgpezzo.push(loadImage("Images/white_bishoop.png"));
  imgpezzo.push(loadImage("Images/white_knight.png"));
  imgpezzo.push(loadImage("Images/white_rook.png"));
  imgpezzo.push(loadImage("Images/white_queen.png"));
  imgpezzo.push(loadImage("Images/white_king.png"));
  
  reader = loadStrings("dna.txt");
}

var pp;

function setup() {
  createCanvas(512, 512);
  // set pieces
  setPieces();

  // initialize board
  for (y = 0; y < width; y += l) {
    col = !col;
    for (x = 0; x < height; x += l) {
      if (col == true) {
        caselle.push(new Casella(x, y, l, color(230)));
        col = false;
      } else {
        caselle.push(new Casella(x, y, l, color(65, 105, 225)));
        col = true;
      }
    }
  }

  pp = createElement("h1", "");
  pp.style("font-size:40p");

  Alice = new AIPlayer("Alice", false, reader);
}

function draw() {
  for (j = 0; j < 64; j++)
    caselle[j].show();

  for (j = 0; j < pezziNeri.length; j++)
    pezziNeri[j].show();
  for (j = 0; j < pezziBianchi.length; j++)
    pezziBianchi[j].show();

  if (turno == "w") {
    pp.html("It's white turn.");
  } else {
    pp.html("It's black turn.");
  }
  if (checkMate != "none") { //(mosseDisponibiliBianco == 0 && turno == "w") || (mosseDisponibiliNero == 0 && turno == "b")) {
    textAlign(CENTER, CENTER);
    rect(0, height / 3, width, height / 3);
    fill(255, 0, 0);
    textSize(25);
    if (controlIfWhiteInCheck(-1) || controlIfBlackInCheck(-1)) {
      text("Check Mate!! " + checkMate + " has won the game!", width / 2, height / 2);
    } else {
      text("Stale Mate!! it's a draw!", width / 2, height / 2);
    }
  }
}

function setPieces() {
  pezziNeri = [];
  pezziBianchi = [];
  bv = 0;
  // blacks
  for (i = 0; i < 8; i++) {
    pezziNeri.push(new Pezzo(i, 1, 64, imgpezzo[0], 0, "pawn", "black", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziNeri.push(new Pezzo(3 * i + 2, 0, 64, imgpezzo[1], 1, "bishoop", "black", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziNeri.push(new Pezzo(5 * i + 1, 0, 64, imgpezzo[2], 2, "knight", "black", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziNeri.push(new Pezzo(i * 7, 0, 64, imgpezzo[3], 3, "rook", "black", bv));
    bv += 64;
  }
  pezziNeri.push(new Pezzo(3, 0, 64, imgpezzo[4], 4, "queen", "black", bv));
  bv += 64;
  pezziNeri.push(new Pezzo(4, 0, 64, imgpezzo[5], 5, "king", "black", bv));
  bv += 64;

  //whites
  for (i = 0; i < 8; i++) {
    pezziBianchi.push(new Pezzo(i, 6, 64, imgpezzo[6], 6, "pawn", "white", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziBianchi.push(new Pezzo(3 * i + 2, 7, 64, imgpezzo[7], 7, "bishoop", "white", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziBianchi.push(new Pezzo(5 * i + 1, 7, 64, imgpezzo[8], 8, "knight", "white", bv));
    bv += 64;
  }
  for (i = 0; i < 2; i++) {
    pezziBianchi.push(new Pezzo(i * 7, 7, 64, imgpezzo[9], 9, "rook", "white", bv));
    bv += 64;
  }
  pezziBianchi.push(new Pezzo(3, 7, 64, imgpezzo[10], 10, "queen", "white", bv));
  bv += 64;
  pezziBianchi.push(new Pezzo(4, 7, 64, imgpezzo[11], 11, "king", "white", bv));
  pezziNeri[0].isAValidMoveforBlack(9, 9, 55);
  pezziBianchi[0].isAValidMoveforWhite(9, 9, 55);
}

function mousePressed() {
  if (checkMate == "none") { //(mosseDisponibiliBianco != 0 && turno == "w") || (mosseDisponibiliNero != 0 && turno == "b")) {
    //print(c++);
    try {
      caselle[currentSelectedX + currentSelectedY * 8].selected = false;
    } catch (err) {}
    oldSelectedX = currentSelectedX;
    oldSelectedY = currentSelectedY;
    currentSelectedX = int(mouseX / l);
    currentSelectedY = int(mouseY / l);
    if ((currentSelectedX != oldSelectedX || currentSelectedY != oldSelectedY) && currentSelectedX < 9 && currentSelectedY < 9) {
      try {
        caselle[currentSelectedX + currentSelectedY * 8].selected = true;
      } catch (err) {}
      for (k = 0; k < pezziNeri.length; k++) {
        if (pezziNeri[k].xx == oldSelectedX && pezziNeri[k].yy == oldSelectedY) {
          try {
            if (pezziNeri[0].isAValidMoveforBlack(currentSelectedX, currentSelectedY, k) && turno == "b") {

              /*caselle[currentSelectedX + currentSelectedY * 8].selected = false;
              pezziNeri[k].move(currentSelectedX, currentSelectedY);
              currentSelectedX = 9;
              currentSelectedY = 9;
              turno = "w";*/

              break;
            }
          } catch (err) {}
        }
      }

      for (k = 0; k < pezziBianchi.length; k++) {
        if (pezziBianchi[k].xx == oldSelectedX && pezziBianchi[k].yy == oldSelectedY) {
          try {
            if (pezziBianchi[0].isAValidMoveforWhite(currentSelectedX, currentSelectedY, k) && turno == "w") {
              caselle[currentSelectedX + currentSelectedY * 8].selected = false;
              pezziBianchi[k].move(currentSelectedX, currentSelectedY);
              currentSelectedX = 9;
              currentSelectedY = 9;
              turno = "b";


              Alice.think();
              turno = "w";
              break;
            }
          } catch (err) {}
        }
      }
    } else {
      currentSelectedX = 9;
      currentSelectedY = 9;
    }

    //print(mosseDisponibiliBianco);

    pezziNeri[0].isAValidMoveforBlack(9, 9, 55);
    pezziBianchi[0].isAValidMoveforWhite(9, 9, 55);
    // coloro le caselle in cui posso muovermi
    /*for (q = 0; q < caselle.length; q++) {
      for (a = 0; a < mosseDisponibiliBianco.length; a++) {
        if (caselle[q].xx / 64 == mosseDisponibiliBianco[a].xx && caselle[q].yy / 64 == mosseDisponibiliBianco[a].yy) {
          caselle[q].selected = true;
          break;
        } else {
          caselle[q].selected = false;
        }
      }
    }*/
  }
}

function controlIfWhiteInCheck(bbb) {
  pezziNeri[0].aggiornaMosseNero(bbb);

  for (mossa = 0; mossa < mosseDisponibiliNero.length; mossa++) {
    for (q = 0; q < pezziBianchi.length; q++) {
      if (pezziBianchi[q].type == "king") {
        if (mosseDisponibiliNero[mossa].xx == pezziBianchi[q].xx && mosseDisponibiliNero[mossa].yy == pezziBianchi[q].yy) {
          return true;
        }
      }
    }
  }
  return false;
}

function controlIfBlackInCheck(bbb) {
  pezziBianchi[0].aggiornaMosseBianchi(bbb);

  for (mossa = 0; mossa < mosseDisponibiliBianco.length; mossa++) {
    for (q = 0; q < pezziNeri.length; q++) {
      if (pezziNeri[q].type == "king") {
        if (mosseDisponibiliBianco[mossa].xx == pezziNeri[q].xx && mosseDisponibiliBianco[mossa].yy == pezziNeri[q].yy) {
          return true;
        }
      }
    }
  }
  return false;
}


class Casella {

  constructor(_x, _y, _l, _col) {
    this.xx = _x;
    this.yy = _y;
    this.ll = _l;
    this.col = _col;
    this.selected = false;
  }

  show() {
    fill(this.col);
    if (this.selected) fill(255, 0, 240);
    rect(this.xx, this.yy, this.ll, this.ll);
  }
}


class Pezzo {

  constructor(_x, _y, _l, _img, _indexImage, _type, _colour, _baseValue) {
    this.xx = _x;
    this.yy = _y;
    this.img = _img;
    this.ll = _l;
    this.type = _type;
    this.indexImage = _indexImage;
    this.colour = _colour;
    this.baseValue = _baseValue;
  }

  show() {
    image(this.img, this.xx * this.ll, this.yy * this.ll, this.ll, this.ll);
  }

  updateBlackMoves(endX, endY, index) {
    pezziNeri[0].aggiornaMosseNero(-1);
    copyArray = [];
    for (sos = 0; sos < mosseDisponibiliNero.length; sos++) {
      sss = pezziNeri[mosseDisponibiliNero[sos].zz].xx;
      ttt = pezziNeri[mosseDisponibiliNero[sos].zz].yy;
      iii = mosseDisponibiliNero[sos].zz;
      pezziNeri[mosseDisponibiliNero[sos].zz].xx = mosseDisponibiliNero[sos].xx;
      pezziNeri[mosseDisponibiliNero[sos].zz].yy = mosseDisponibiliNero[sos].yy;

      //isOneDeleted = false;
      for (b = 0; b < pezziBianchi.length; b++) {
        if (pezziBianchi[b].xx == pezziNeri[iii].xx && pezziBianchi[b].yy == pezziNeri[iii].yy) {
          //isOneDeleted = true;
          nomePezzoEliminato = pezziBianchi[b].type;
          nomePezzoEliminatoIndexImage = pezziBianchi[b].indexImage;
          nomePezzoEliminatoX = pezziBianchi[b].xx;
          nomePezzoEliminatoY = pezziBianchi[b].yy;
          //pezziBianchi.splice(b, 1);
          break;
        }
      }
      if (b == pezziBianchi.length) {
        b = -1;
      }
      pezziNeri[0].aggiornaMosseNero(b);

      if (controlIfBlackInCheck(b) == false) {
        pezziNeri[iii].xx = sss;
        pezziNeri[iii].yy = ttt;
        /*if (isOneDeleted) {
          pezziBianchi.push(new Pezzo(nomePezzoEliminatoX, nomePezzoEliminatoY, 64, imgpezzo[nomePezzoEliminatoIndexImage], nomePezzoEliminato, "white"));
        }*/
        pezziNeri[0].aggiornaMosseNero(-1);
        copyArray.push(mosseDisponibiliNero[sos]);
      } else {
        pezziNeri[iii].xx = sss;
        pezziNeri[iii].yy = ttt;
        /*if (isOneDeleted) {
          pezziBianchi.push(new Pezzo(nomePezzoEliminatoX, nomePezzoEliminatoY, 64, imgpezzo[nomePezzoEliminatoIndexImage], nomePezzoEliminato, "white"));
        }*/
        pezziNeri[0].aggiornaMosseNero(-1);
      }
    }
    mosseDisponibiliNero = copyArray;
    //print(mosseDisponibiliNero);
    if (mosseDisponibiliNero.length == 0) {
      return true;
    }
    return false;
  }

  aggiornaMosseNero(bbbb) {
    // calcolo tutte le mosse disponibili mettendole in un array: mosseDisponibiliNero
    mosseDisponibiliNero = [];
    for (z = 0; z < pezziNeri.length; z++) {
      if (z != bbbb) {
        switch (pezziNeri[z].type) {
          case "pawn":
            caso1 = true;
            if (pezziNeri[z].yy == 1) {
              caso2 = true;
            } else {
              caso2 = false;
            }
            for (q = 0; q < pezziNeri.length; q++) {
              if (pezziNeri[q].xx == pezziNeri[z].xx && pezziNeri[q].yy == pezziNeri[z].yy + 1 && q != bbbb) {
                caso1 = false;
                break;
              }
              if (pezziNeri[z].xx == 1 && pezziNeri[q].xx == pezziNeri[z].xx && pezziNeri[q].yy == pezziNeri[z].yy + 2 && q != bbbb) {
                caso2 = false;
                break;
              }
            }
            for (a = 0; a < pezziBianchi.length; a++) {
              if (pezziBianchi[a].xx + 1 == pezziNeri[z].xx && pezziBianchi[a].yy == pezziNeri[z].yy + 1) {
                mosseDisponibiliNero.push(new Point(pezziNeri[z].xx - 1, pezziNeri[z].yy + 1, z, true));
              }
              if (pezziBianchi[a].xx - 1 == pezziNeri[z].xx && pezziBianchi[a].yy == pezziNeri[z].yy + 1) {
                mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + 1, pezziNeri[z].yy + 1, z, true));
              }
              if (pezziBianchi[a].xx == pezziNeri[z].xx && pezziBianchi[a].yy == pezziNeri[z].yy + 1) {
                caso1 = false;
              }
              if (pezziNeri[z].yy == 1 && pezziBianchi[a].xx == pezziNeri[z].xx && pezziBianchi[a].yy == pezziNeri[z].yy + 2) {
                caso2 = false;
              }
              if (pezziNeri[z].yy == 1 && pezziBianchi[a].xx == pezziNeri[z].xx && pezziBianchi[a].yy == pezziNeri[z].yy + 2) {
                caso2 = false;
              }
            }
            if (caso1) {
              mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + 1, z, false));
            }
            if (caso2 && caso1) {
              mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + 2, z, false));
            }
            break;
          case "bishoop":
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                x = 1;
                y = 1;
                broken = false;
                while (pezziNeri[z].xx + x * q < 8 && pezziNeri[z].yy + y * a < 8 && pezziNeri[z].xx + x * q >= 0 && pezziNeri[z].yy + y * a >= 0) {
                  for (aa = 0; aa < pezziNeri.length; aa++)
                    if (pezziNeri[aa].xx == pezziNeri[z].xx + x * q && pezziNeri[aa].yy == pezziNeri[z].yy + y * a && aa != bbbb) {
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  for (aa = 0; aa < pezziBianchi.length; aa++)
                    if (pezziBianchi[aa].xx == pezziNeri[z].xx + x * q && pezziBianchi[aa].yy == pezziNeri[z].yy + y * a) {
                      mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * q, pezziNeri[z].yy + y * a, z, true));
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * q, pezziNeri[z].yy + y * a, z, false));
                  x++;
                  y++;
                }
              }
            }
            break;
          case "knight":
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                caso1 = true;
                caso2 = true;
                if ((pezziNeri[z].xx + q < 0 || pezziNeri[z].yy + a * 2 < 0) || (pezziNeri[z].xx + q > 7 || pezziNeri[z].yy + a * 2 > 7)) {
                  caso1 = false;
                }
                if ((pezziNeri[z].xx + q * 2 < 0 || pezziNeri[z].yy + a < 0) || (pezziNeri[z].xx + q * 2 > 7 || pezziNeri[z].yy + a > 7)) {
                  caso2 = false;
                }
                for (aa = 0; aa < pezziNeri.length; aa++) {
                  if (caso1 && pezziNeri[aa].xx == pezziNeri[z].xx + q && pezziNeri[aa].yy == pezziNeri[z].yy + a * 2 && aa != bbbb) {
                    caso1 = false;
                  }

                  if (caso2 && pezziNeri[aa].xx == pezziNeri[z].xx + q * 2 && pezziNeri[aa].yy == pezziNeri[z].yy + a && aa != bbbb) {
                    caso2 = false;
                  }
                }

                for (aa = 0; aa < pezziBianchi.length; aa++) {
                  if (pezziBianchi[aa].xx == pezziNeri[z].xx + q && pezziBianchi[aa].yy == pezziNeri[z].yy + a * 2) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q, pezziNeri[z].yy + a * 2, z, true));
                    caso1 = false;
                  }
                  if (pezziBianchi[aa].xx == pezziNeri[z].xx + q * 2 && pezziBianchi[aa].yy == pezziNeri[z].yy + a) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q * 2, pezziNeri[z].yy + a, z, true));
                    caso2 = false;
                  }
                }

                if (caso1) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q, pezziNeri[z].yy + a * 2, z, false));
                }
                if (caso2) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q * 2, pezziNeri[z].yy + a, z, false));
                }
              }
            }
            break;
          case "rook":
            /*for (q = -1; q < 2; q += 2) {
              caso1 = true;
              caso2 = true;
              xxx = 1;
              yyy = 1;
              while (caso1 || caso2) {
                for (aa = 0; aa < pezziNeri.length; aa++) {
                  if ((pezziNeri[z].xx + xxx * q == pezziNeri[aa].xx && pezziNeri[z].yy == pezziNeri[aa].yy) || (pezziNeri[z].xx + xxx * q < 0 || pezziNeri[z].xx + xxx * q > 7)) {
                    caso1 = false;
                  }
                  if ((pezziNeri[z].xx == pezziNeri[aa].xx && pezziNeri[z].yy + yyy * q == pezziNeri[aa].yy) || (pezziNeri[z].yy + yyy * q < 0 || pezziNeri[z].yy + yyy * q > 7)) {
                    caso2 = false;
                  }
                }
                for (aa = 0; aa < pezziBianchi.length; aa++) {
                  if (pezziNeri[z].xx + xxx * q == pezziBianchi[aa].xx && pezziNeri[z].yy == pezziBianchi[aa].yy) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + xxx * q, pezziNeri[z].yy, z, true));
                    caso1 = false;
                  }
                  if (pezziNeri[z].xx == pezziBianchi[aa].xx && pezziNeri[z].yy + yyy * q == pezziBianchi[aa].yy) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + yyy * q, z, true));
                    caso2 = false;
                  }
                }

                if (caso1) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + xxx * q, pezziNeri[z].yy, z, false));
                }
                if (caso2) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + yyy * q, z, false));
                }
                xxx++;
                yyy++;
              }
            }*/
            for (rk1 = -1; rk1 < 2; rk1 += 2) {
              x = 1;
              op1 = true;
              op2 = true;
              while ((op1 || op2) && x < 8) {
                // guardo se c'e' un pezzo nero e nel caso non continuo ad aggiungere la mossa
                for (rk2 = 0; rk2 < pezziNeri.length; rk2++) {
                  // check case1 (moving on x)
                  if ((pezziNeri[rk2].xx == pezziNeri[z].xx + x * rk1 && pezziNeri[rk2].yy == pezziNeri[z].yy) && op1 && rk2 != bbbb) {
                    op1 = false;
                  }
                  if ((pezziNeri[rk2].xx == pezziNeri[z].xx && pezziNeri[rk2].yy == pezziNeri[z].yy + x * rk1) && op2 && rk2 != bbbb) {
                    op2 = false;
                  }
                }
                for (rk2 = 0; rk2 < pezziBianchi.length; rk2++) {
                  if ((pezziNeri[z].xx + x * rk1 == pezziBianchi[rk2].xx && pezziNeri[z].yy == pezziBianchi[rk2].yy) && op1) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * rk1, pezziNeri[z].yy, z, true));
                    op1 = false;
                  }
                  if ((pezziNeri[z].xx == pezziBianchi[rk2].xx && pezziNeri[z].yy + x * rk1 == pezziBianchi[rk2].yy) && op2) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + x * rk1, z, true));
                    op2 = false;
                  }

                }

                if (op1) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * rk1, pezziNeri[z].yy, z, false));
                }
                if (op2) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + x * rk1, z, false));
                }

                x++;
              }
            }
            break;
          case "queen":
            // codice dell'alfiere
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                x = 1;
                y = 1;
                broken = false;
                while (pezziNeri[z].xx + x * q < 8 && pezziNeri[z].yy + y * a < 8 && pezziNeri[z].xx + x * q >= 0 && pezziNeri[z].yy + y * a >= 0) {
                  for (aa = 0; aa < pezziNeri.length; aa++)
                    if (pezziNeri[aa].xx == pezziNeri[z].xx + x * q && pezziNeri[aa].yy == pezziNeri[z].yy + y * a && aa != bbbb) {
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  for (aa = 0; aa < pezziBianchi.length; aa++)
                    if (pezziBianchi[aa].xx == pezziNeri[z].xx + x * q && pezziBianchi[aa].yy == pezziNeri[z].yy + y * a) {
                      mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * q, pezziNeri[z].yy + y * a, z, true));
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * q, pezziNeri[z].yy + y * a, z, false));
                  x++;
                  y++;
                }
              }
            }
            // codice della torre
            for (rk1 = -1; rk1 < 2; rk1 += 2) {
              x = 1;
              op1 = true;
              op2 = true;
              while ((op1 || op2) && x < 8) {
                // guardo se c'e' un pezzo nero e nel caso non continuo ad aggiungere la mossa
                for (rk2 = 0; rk2 < pezziNeri.length; rk2++) {
                  // check case1 (moving on x)
                  if ((pezziNeri[rk2].xx == pezziNeri[z].xx + x * rk1 && pezziNeri[rk2].yy == pezziNeri[z].yy) && op1 && rk2 != bbbb) {
                    op1 = false;
                  }
                  if ((pezziNeri[rk2].xx == pezziNeri[z].xx && pezziNeri[rk2].yy == pezziNeri[z].yy + x * rk1) && op2 && rk2 != bbbb) {
                    op2 = false;
                  }
                }
                for (rk2 = 0; rk2 < pezziBianchi.length; rk2++) {
                  if ((pezziNeri[z].xx + x * rk1 == pezziBianchi[rk2].xx && pezziNeri[z].yy == pezziBianchi[rk2].yy) && op1) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * rk1, pezziNeri[z].yy, z, true));
                    op1 = false;
                  }
                  if ((pezziNeri[z].xx == pezziBianchi[rk2].xx && pezziNeri[z].yy + x * rk1 == pezziBianchi[rk2].yy) && op2) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + x * rk1, z, true));
                    op2 = false;
                  }

                }

                if (op1) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + x * rk1, pezziNeri[z].yy, z, false));
                }
                if (op2) {
                  mosseDisponibiliNero.push(new Point(pezziNeri[z].xx, pezziNeri[z].yy + x * rk1, z, false));
                }

                x++;
              }
            }
            break;
          case "king":
            for (q = -1; q < 2; q++) {
              for (a = -1; a < 2; a++) {
                if (a != 0 || q != 0) {
                  caso1 = true;
                  for (aa = 0; aa < pezziNeri.length; aa++) {
                    if (((pezziNeri[z].xx + q == pezziNeri[aa].xx && pezziNeri[z].yy + a == pezziNeri[aa].yy) || (pezziNeri[z].xx + q < 0 || pezziNeri[z].xx + q > 7) || (pezziNeri[z].yy + a < 0 || pezziNeri[z].yy + a > 7)) && aa != bbbb) {
                      caso1 = false;
                    }
                  }
                  for (aa = 0; aa < pezziBianchi.length; aa++) {
                    if (pezziNeri[z].xx + q == pezziBianchi[aa].xx && pezziNeri[z].yy + a == pezziBianchi[aa].yy) {
                      mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q, pezziNeri[z].yy + a, z, true));
                      caso1 = false;
                    }
                  }
                  if (caso1) {
                    mosseDisponibiliNero.push(new Point(pezziNeri[z].xx + q, pezziNeri[z].yy + a, z, false));
                  }
                }
              }
            }
            break;
        }
      }
    }
    for (z = 0; z < mosseDisponibiliNero.length; z++) {
      if (mosseDisponibiliNero[z].xx < 0 || mosseDisponibiliNero[z].yy < 0 || mosseDisponibiliNero[z].xx > 7 || mosseDisponibiliNero[z].yy > 7) {
        mosseDisponibiliNero.splice(z, 1);
        --z;
      }
    }
  }

  isAValidMoveforBlack(endX, endY, index) {
    pezziNeri[0].updateBlackMoves(endX, endY)/*) {
      checkMate = "white";
      return false;
    }*/

    for (mossa = 0; mossa < mosseDisponibiliNero.length; mossa++) {
      if (endX == mosseDisponibiliNero[mossa].xx && endY == mosseDisponibiliNero[mossa].yy && index == mosseDisponibiliNero[mossa].zz) {
        for (q = 0; q < pezziBianchi.length; q++) {
          if (endX == pezziBianchi[q].xx && endY == pezziBianchi[q].yy && turno == "b") {
            pezziBianchi.splice(q, 1);
            break;
          }
        }

        return true;
      }
    }
    return false;
  }

  updateWhiteMoves(endX, endY, index) {
    pezziBianchi[0].aggiornaMosseBianchi(-1);
    copyArray = [];
    for (sos = 0; sos < mosseDisponibiliBianco.length; sos++) {
      sss = pezziBianchi[mosseDisponibiliBianco[sos].zz].xx;
      ttt = pezziBianchi[mosseDisponibiliBianco[sos].zz].yy;
      iii = mosseDisponibiliBianco[sos].zz;
      pezziBianchi[mosseDisponibiliBianco[sos].zz].xx = mosseDisponibiliBianco[sos].xx;
      pezziBianchi[mosseDisponibiliBianco[sos].zz].yy = mosseDisponibiliBianco[sos].yy;

      isOneDeleted = false;
      for (b = 0; b < pezziNeri.length; b++) {
        if (pezziNeri[b].xx == pezziBianchi[iii].xx && pezziNeri[b].yy == pezziBianchi[iii].yy) {
          isOneDeleted = true;
          nomePezzoEliminato = pezziNeri[b].type;
          nomePezzoEliminatoIndexImage = pezziNeri[b].indexImage;
          nomePezzoEliminatoX = pezziNeri[b].xx;
          nomePezzoEliminatoY = pezziNeri[b].yy;
          //pezziNeri.splice(b, 1);
          break;
        }
      }
      if (b == pezziNeri.length) {
        b = -1;
      }
      pezziBianchi[0].aggiornaMosseBianchi(b);

      if (controlIfWhiteInCheck(b) == false) {
        pezziBianchi[iii].xx = sss;
        pezziBianchi[iii].yy = ttt;
        /*if (isOneDeleted) {
          pezziNeri.push(new Pezzo(nomePezzoEliminatoX, nomePezzoEliminatoY, 64, imgpezzo[nomePezzoEliminatoIndexImage], nomePezzoEliminato, "black"));
          print(22);
        }*/
        pezziBianchi[0].aggiornaMosseBianchi(-1);
        copyArray.push(mosseDisponibiliBianco[sos]);
      } else {
        pezziBianchi[iii].xx = sss;
        pezziBianchi[iii].yy = ttt;
        /*if (isOneDeleted) {
          pezziNeri.push(new Pezzo(nomePezzoEliminatoX, nomePezzoEliminatoY, 64, imgpezzo[nomePezzoEliminatoIndexImage], nomePezzoEliminato, "black"));
          print(23);
        }*/
        pezziBianchi[0].aggiornaMosseBianchi(-1);
      }
    }
    mosseDisponibiliBianco = copyArray;

    if (mosseDisponibiliBianco.length == 0) {
      return true;
    }
    return false;
  }


  aggiornaMosseBianchi(bbbb) {
    mosseDisponibiliBianco = [];
    for (z = 0; z < pezziBianchi.length; z++) {
      if (z != bbbb) {
        switch (pezziBianchi[z].type) {
          case "pawn":
            caso1 = true;
            if (pezziBianchi[z].yy == 6) {
              caso2 = true;
            } else {
              caso2 = false;
            }
            for (q = 0; q < pezziBianchi.length; q++) {
              if (pezziBianchi[q].xx == pezziBianchi[z].xx && pezziBianchi[q].yy == pezziBianchi[z].yy - 1 && q != bbbb) {
                caso1 = false;
                break;
              }
              if (pezziBianchi[z].yy == 6 && pezziBianchi[q].xx == pezziBianchi[z].xx && pezziBianchi[q].yy == pezziBianchi[z].yy - 2 && q != bbbb) {
                caso2 = false;
                break;
              }
            }
            for (a = 0; a < pezziNeri.length; a++) {
              if (pezziNeri[a].xx + 1 == pezziBianchi[z].xx && pezziNeri[a].yy == pezziBianchi[z].yy - 1) {
                mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx - 1, pezziBianchi[z].yy - 1, z, true));
              }
              if (pezziNeri[a].xx - 1 == pezziBianchi[z].xx && pezziNeri[a].yy == pezziBianchi[z].yy - 1) {
                mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + 1, pezziBianchi[z].yy - 1, z, true));
              }
              if (pezziNeri[a].xx == pezziBianchi[z].xx && pezziNeri[a].yy == pezziBianchi[z].yy - 1) {
                caso1 = false;
              }
              if (pezziBianchi[z].yy == 6 && pezziNeri[a].xx == pezziBianchi[z].xx && pezziNeri[a].yy == pezziBianchi[z].yy - 2) {
                caso2 = false;
              }
              if (pezziBianchi[z].yy == 6 && pezziNeri[a].xx == pezziBianchi[z].xx && pezziNeri[a].yy == pezziBianchi[z].yy - 2) {
                caso2 = false;
              }
            }
            if (caso1) {
              mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy - 1, z, false));
            }
            if (caso2) {
              mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy - 2, z, false));
            }
            break;
          case "bishoop":
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                x = 1;
                y = 1;
                broken = false;
                while (pezziBianchi[z].xx + x * q < 8 && pezziBianchi[z].yy + y * a < 8 && pezziBianchi[z].xx + x * q >= 0 && pezziBianchi[z].yy + y * a >= 0) {
                  for (aa = 0; aa < pezziBianchi.length; aa++)
                    if (pezziBianchi[aa].xx == pezziBianchi[z].xx + x * q && pezziBianchi[aa].yy == pezziBianchi[z].yy + y * a && aa != bbbb) {
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  for (aa = 0; aa < pezziNeri.length; aa++)
                    if (pezziNeri[aa].xx == pezziBianchi[z].xx + x * q && pezziNeri[aa].yy == pezziBianchi[z].yy + y * a) {
                      mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy + y * a, z, true));
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy + y * a, z, false));
                  x++;
                  y++;
                }
              }
            }
            break;
          case "knight":
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                caso1 = true;
                caso2 = true;
                if ((pezziBianchi[z].xx + q < 0 || pezziBianchi[z].yy + a * 2 < 0) || (pezziBianchi[z].xx + q > 7 || pezziBianchi[z].yy + a * 2 > 7)) {
                  caso1 = false;
                }
                if ((pezziBianchi[z].xx + q * 2 < 0 || pezziBianchi[z].yy + a < 0) || (pezziBianchi[z].xx + q * 2 > 7 || pezziBianchi[z].yy + a > 7)) {
                  caso2 = false;
                }
                for (aa = 0; aa < pezziBianchi.length; aa++) {
                  if (caso1 && pezziBianchi[aa].xx == pezziBianchi[z].xx + q && pezziBianchi[aa].yy == pezziBianchi[z].yy + a * 2 && aa != bbbb) {
                    caso1 = false;
                  }

                  if (caso2 && pezziBianchi[aa].xx == pezziBianchi[z].xx + q * 2 && pezziBianchi[aa].yy == pezziBianchi[z].yy + a && aa != bbbb) {
                    caso2 = false;
                  }
                }

                for (aa = 0; aa < pezziNeri.length; aa++) {
                  if (pezziNeri[aa].xx == pezziBianchi[z].xx + q && pezziNeri[aa].yy == pezziBianchi[z].yy + a * 2) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q, pezziBianchi[z].yy + a * 2, z, true));
                    caso1 = false;
                  }
                  if (pezziNeri[aa].xx == pezziBianchi[z].xx + q * 2 && pezziNeri[aa].yy == pezziBianchi[z].yy + a) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q * 2, pezziBianchi[z].yy + a, z, true));
                    caso2 = false;
                  }
                }

                if (caso1) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q, pezziBianchi[z].yy + a * 2, z, false));
                }
                if (caso2) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q * 2, pezziBianchi[z].yy + a, z, false));
                }
              }
            }
            break;
          case "rook":
            /*for (q = -1; q < 2; q += 2) {
              caso1 = true;
              caso2 = true;
              x = 1;
              y = 1;
              while (caso1 || caso2) {
                for (aa = 0; aa < pezziBianchi.length; aa++) {
                  if ((pezziBianchi[z].xx + x * q == pezziBianchi[aa].xx && pezziBianchi[z].yy == pezziBianchi[aa].yy) || (pezziBianchi[z].xx + x * q < 0 || pezziBianchi[z].xx + x * q > 7)) {
                    caso1 = false;
                  }
                  if ((pezziBianchi[z].xx == pezziBianchi[aa].xx && pezziBianchi[z].yy + y * q == pezziBianchi[aa].yy) || (pezziBianchi[z].yy + y * q < 0 || pezziBianchi[z].yy + y * q > 7)) {
                    caso2 = false;
                  }
                }
                for (aa = 0; aa < pezziNeri.length; aa++) {
                  if (pezziBianchi[z].xx + x * q == pezziNeri[aa].xx && pezziBianchi[z].yy == pezziNeri[aa].yy) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy, z, true));
                    caso1 = false;
                  }
                  if (pezziBianchi[z].xx == pezziNeri[aa].xx && pezziBianchi[z].yy + y * q == pezziNeri[aa].yy) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + y * q, z, true));
                    caso2 = false;
                  }
                }

                if (caso1) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy, z, false));
                }
                if (caso2) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + y * q, z, false));
                }
                x++;
                y++;
              }
            }*/
            for (rk1 = -1; rk1 < 2; rk1 += 2) {
              x = 1;
              op1 = true;
              op2 = true;
              while ((op1 || op2) && x < 8) {
                // guardo se c'e' un pezzo nero e nel caso non continuo ad aggiungere la mossa
                for (rk2 = 0; rk2 < pezziBianchi.length; rk2++) {
                  // check case1 (moving on x)
                  if ((pezziBianchi[rk2].xx == pezziBianchi[z].xx + x * rk1 && pezziBianchi[rk2].yy == pezziBianchi[z].yy) && op1 && rk2 != bbbb) {
                    op1 = false;
                  }
                  if ((pezziBianchi[rk2].xx == pezziBianchi[z].xx && pezziBianchi[rk2].yy == pezziBianchi[z].yy + x * rk1) && op2 && rk2 != bbbb) {
                    op2 = false;
                  }
                }

                for (rk2 = 0; rk2 < pezziNeri.length; rk2++) {
                  if ((pezziBianchi[z].xx + x * rk1 == pezziNeri[rk2].xx && pezziBianchi[z].yy == pezziNeri[rk2].yy) && op1) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * rk1, pezziBianchi[z].yy, z, true));
                    op1 = false;
                  }

                  if ((pezziBianchi[z].xx == pezziNeri[rk2].xx && pezziBianchi[z].yy + x * rk1 == pezziNeri[rk2].yy) && op2) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + x * rk1, z, true));
                    op2 = false;
                  }
                }

                if (op1) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * rk1, pezziBianchi[z].yy, z, false));
                }
                if (op2) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + x * rk1, z, false));
                }

                x++;
              }
            }
            break;
          case "queen":
            // codice dell'alfiere
            for (q = -1; q < 2; q += 2) {
              for (a = -1; a < 2; a += 2) {
                x = 1;
                y = 1;
                broken = false;
                while (pezziBianchi[z].xx + x * q < 8 && pezziBianchi[z].yy + y * a < 8 && pezziBianchi[z].xx + x * q >= 0 && pezziBianchi[z].yy + y * a >= 0) {
                  for (aa = 0; aa < pezziBianchi.length; aa++)
                    if (pezziBianchi[aa].xx == pezziBianchi[z].xx + x * q && pezziBianchi[aa].yy == pezziBianchi[z].yy + y * a && aa != bbbb) {
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  for (aa = 0; aa < pezziNeri.length; aa++)
                    if (pezziNeri[aa].xx == pezziBianchi[z].xx + x * q && pezziNeri[aa].yy == pezziBianchi[z].yy + y * a) {
                      mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy + y * a, z, true));
                      broken = true;
                      break;
                    }
                  if (broken) break;
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * q, pezziBianchi[z].yy + y * a, z, false));
                  x++;
                  y++;
                }
              }
            }
            // codice della torre
            for (rk1 = -1; rk1 < 2; rk1 += 2) {
              x = 1;
              op1 = true;
              op2 = true;
              while ((op1 || op2) && x < 8) {
                // guardo se c'e' un pezzo nero e nel caso non continuo ad aggiungere la mossa
                for (rk2 = 0; rk2 < pezziBianchi.length; rk2++) {
                  // check case1 (moving on x)
                  if ((pezziBianchi[rk2].xx == pezziBianchi[z].xx + x * rk1 && pezziBianchi[rk2].yy == pezziBianchi[z].yy) && op1) {
                    op1 = false;
                  }
                  if ((pezziBianchi[rk2].xx == pezziBianchi[z].xx && pezziBianchi[rk2].yy == pezziBianchi[z].yy + x * rk1) && op2) {
                    op2 = false;
                  }
                }

                for (rk2 = 0; rk2 < pezziNeri.length; rk2++) {
                  if ((pezziBianchi[z].xx + x * rk1 == pezziNeri[rk2].xx && pezziBianchi[z].yy == pezziNeri[rk2].yy) && op1) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * rk1, pezziBianchi[z].yy, z, true));
                    op1 = false;
                  }

                  if ((pezziBianchi[z].xx == pezziNeri[rk2].xx && pezziBianchi[z].yy + x * rk1 == pezziNeri[rk2].yy) && op2) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + x * rk1, z, true));
                    op2 = false;
                  }
                }

                if (op1) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + x * rk1, pezziBianchi[z].yy, z, false));
                }
                if (op2) {
                  mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx, pezziBianchi[z].yy + x * rk1, z, false));
                }

                x++;
              }
            }
            break;
          case "king":
            for (q = -1; q < 2; q++) {
              for (a = -1; a < 2; a++) {
                if (a != 0 || q != 0) {
                  caso1 = true;
                  for (aa = 0; aa < pezziBianchi.length; aa++) {
                    if (((pezziBianchi[z].xx + q == pezziBianchi[aa].xx && pezziBianchi[z].yy + a == pezziBianchi[aa].yy) || (pezziBianchi[z].xx + q < 0 || pezziBianchi[z].xx + q > 7) || (pezziBianchi[z].yy + a < 0 || pezziBianchi[z].yy + a > 7)) && aa != bbbb) {
                      caso1 = false;
                    }
                  }
                  for (aa = 0; aa < pezziNeri.length; aa++) {
                    if (pezziBianchi[z].xx + q == pezziNeri[aa].xx && pezziBianchi[z].yy + a == pezziNeri[aa].yy) {
                      mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q, pezziBianchi[z].yy + a, z, true));
                      caso1 = false;
                    }
                  }
                  if (caso1) {
                    mosseDisponibiliBianco.push(new Point(pezziBianchi[z].xx + q, pezziBianchi[z].yy + a, z, false));
                  }
                }
              }
            }
            break;
        }
      }
    }
    for (z = 0; z < mosseDisponibiliBianco.length; z++) {
      if (mosseDisponibiliBianco[z].xx < 0 || mosseDisponibiliBianco[z].yy < 0 || mosseDisponibiliBianco[z].xx > 7 || mosseDisponibiliBianco[z].yy > 7) {
        mosseDisponibiliBianco.splice(z, 1);
        --z;
      }
    }
  }

  isAValidMoveforWhite(endX, endY, index) {
    pezziBianchi[0].updateWhiteMoves(endX, endY, index)/*) {
      checkMate = "black";
      return false;
    }*/
    for (mossa = 0; mossa < mosseDisponibiliBianco.length; mossa++) {
      if (endX == mosseDisponibiliBianco[mossa].xx && endY == mosseDisponibiliBianco[mossa].yy && index == mosseDisponibiliBianco[mossa].zz) {
        for (q = 0; q < pezziNeri.length; q++) {
          if (endX == pezziNeri[q].xx && endY == pezziNeri[q].yy && turno == "w") {
            pezziNeri.splice(q, 1);
            break;
          }
        }
        return true;
      }
    }
    return false;
  }

  move(endX, endY) {
    this.xx = endX;
    this.yy = endY;
    if (this.yy == 0){
      this.type = "queen";
      this.baseValue = 1920;
      this.img = imgPezzo[10];
    }
  }
}


class Point {

  constructor(_x, _y, _z, _cattura) {
    this.xx = _x;
    this.yy = _y;
    this.zz = _z;
    this.cattura = _cattura;
  }
}

// AI SECTION
class AIPlayer {

  constructor(_id, _IsNew, _preDna) {
    this.id = _id;
    this.dna = new DNA(_IsNew, _preDna);
  }

  think() {
    //print("mmm");
    pezziBianchi[0].updateWhiteMoves(9, 9, 55);
    if (mosseDisponibiliBianco.length == 0) {
      checkMate = "black";
    }
    pezziNeri[0].updateBlackMoves(9, 9, 55);
    if (mosseDisponibiliNero.length == 0) {
      checkMate = "white";
    }

    //print(mosseDisponibiliNero);
    // coloro le caselle in cui posso muovermi
    /*for (q = 0; q < caselle.length; q++) {
      for (a = 0; a < mosseDisponibiliNero.length; a++) {
        if (caselle[q].xx / 64 == mosseDisponibiliNero[a].xx && caselle[q].yy / 64 == mosseDisponibiliNero[a].yy) {
          caselle[q].selected = true;
          break;
        } else {
          caselle[q].selected = false;
        }
      }
    }*/
    //print(mosseDisponibiliNero);
    indexChosen = this.dna.decide(mosseDisponibiliBianco, mosseDisponibiliNero);
    pezziNeri[mosseDisponibiliNero[indexChosen].zz].xx = mosseDisponibiliNero[indexChosen].xx;
    pezziNeri[mosseDisponibiliNero[indexChosen].zz].yy = mosseDisponibiliNero[indexChosen].yy;
    for (g = 0; g < pezziBianchi.length; g++) {
      if (pezziBianchi[g].xx == mosseDisponibiliNero[indexChosen].xx && pezziBianchi[g].yy == mosseDisponibiliNero[indexChosen].yy) {
        pezziBianchi.splice(g, 1);
        break;
      }
    }
  }
}

class DNA {

  constructor(_IsNew, _preDna) {
    this.weight = [];
    this.nodeHl1 = [];
    this.nodeHl2 = [];
    if (_IsNew) {
      for (g = 0; g < 271750; g++) {
        this.weight.push(random(-4, 4));
      }
    } else {
      for (g = 0; g < 271750; g++){
        this.weight.push(float(_preDna[g]));
      }
    }
  }

  // indici dna
  //var p, o, m, v, t, cont, saveX, saveY, eatedX, eatedY, Hindex, eatedIndex;
  decide(mosseBianco, mosseNero) {
    cont = 0

    Hindex = 0;
    Hscore = -10000;

    for (o = 0; o < mosseNero.length; o++) {
      this.nodeHl1 = [];
      this.nodeHl2 = [];
      // simulo la mossa
      saveX = pezziNeri[mosseNero[o].zz].xx;
      saveY = pezziNeri[mosseNero[o].zz].yy;
      pezziNeri[mosseNero[o].zz].xx = mosseNero[o].xx;
      pezziNeri[mosseNero[o].zz].yy = mosseNero[o].yy;
      // controllo se mangio qualcosa
      for (t = 0; t < pezziBianchi.length; t++) {
        if (pezziNeri[mosseNero[o].zz].xx == pezziBianchi[t].xx && pezziNeri[mosseNero[o].zz].yy == pezziBianchi[t].yy) {
          eatedIndex = t;
          break;
        }
      }
      if (t == pezziBianchi.length) {
        eatedIndex = 99;
      }
      for (p = 0; p < 125; p++) {
        // hidden layer N one
        cont = 0;
        for (m = 0; m < pezziNeri.length; m++) {
          cont += this.weight[p * 2048 + pezziNeri[m].baseValue + pezziNeri[m].xx + pezziNeri[m].yy * 8];
        }
        for (m = 0; m < pezziBianchi.length; m++) {
          if (m != eatedIndex) {
            cont += this.weight[p * 2048 + pezziBianchi[m].baseValue + pezziBianchi[m].xx + pezziBianchi[m].yy * 8];
          }
        }
        this.nodeHl1.push(cont);
      }

      for (p = 0; p < 125; p++) {
        cont = 0;
        for (m = 0; m < this.nodeHl1.length; m++) {
          cont += this.nodeHl1[m] * this.weight[256000 + p * 125 + m];
        }
        this.nodeHl2.push(cont);
      }
      cont = 0;
      for (p = 0; p < this.nodeHl2.length; p++) {
        cont += this.nodeHl2[p] * this.weight[271625 + p];
      }

      if (cont > Hscore) {
        Hindex = o;
        Hscore = cont;
      }
      // resetto la mossa eseguita
      pezziNeri[mosseNero[o].zz].xx = saveX;
      pezziNeri[mosseNero[o].zz].yy = saveY;
    }
    return Hindex;
  }
}
