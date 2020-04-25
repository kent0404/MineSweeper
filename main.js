document.oncontextmenu = function () { return false }

onchange = function () { }
Newgame = function () { }

$(document).ready(function () {

  onchange = function () {
    if (document.getElementById('v1').checked) {
      device = 'pc'
      document.getElementById('rule').textContent = '左クリックで開く、右クリックで旗設置、旗撤去'
    } else {
      device = 'other'
      document.getElementById('rule').textContent = 'タップで開く、旗撤去、長押しで旗設置'
    }
  }

  Newgame = function () {
    elements = [];
    X記憶 = -1;
    Y記憶 = -1;
    opened = 0;
    putFlags = 0;
    paraFlag.textContent = '残り🏴：' + bomb数;
    for (let i = 0; i < cell数横 * cell数縦; i++) {
      elements.push({ around: 0, open: false, bomb: false, flag: false, color: 'None' });
    }
    drawMinsweepercell();
    NewGame.innerHTML=''
  }

  paper.install(window);
  paper.setup(document.getElementById('mainCanvas'));

  let device = 'other';
  const cell数横 = 30;
  const bomb数 = 100;
  const cell数縦 = cell数横 / 2;
  let length横 = Number(mainCanvas.style.width.substr(0, mainCanvas.style.width.length - 2));
  document.getElementById('v2').checked = true;
  if (length横 === 0) {
    length横 = Number(mainCanvas.width);
    document.getElementById('v1').checked = true;
    device = 'pc';
  }
  onchange();
  const cellSize = length横 / cell数横;

  let elements = [];
  const around = [[1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
  let X記憶 = -1;
  let Y記憶 = -1;
  let opened = 0;
  let putFlags = 0;
  let hundle;
  let para1 = document.getElementsByTagName('p')[0];
  let paraFlag = document.getElementById('flag');
  let NewGame = document.getElementById('NewGame');
  paraFlag.textContent = '残り🏴：' + bomb数

  function out二次元配列(X, Y, 出すもの) {
    if (0 <= X && X < cell数横 && 0 <= Y && Y < cell数縦) {
      switch (出すもの) {
        case 'around':
          return elements[X + Y * cell数横].around;
        case 'open':
          return elements[X + Y * cell数横].open;
        case 'bomb':
          return elements[X + Y * cell数横].bomb;
        case 'flag':
          return elements[X + Y * cell数横].flag;
        case 'color':
          return elements[X + Y * cell数横].color;
      }
    } else {
      return 'None';
    }
  }

  function in二次元配列(X, Y, 入れるもの, value) {
    if (0 <= X && X < cell数横 && 0 <= Y && Y < cell数縦) {
      switch (入れるもの) {
        case 'around':
          elements[X + Y * cell数横].around = value;
          break;
        case 'open':
          elements[X + Y * cell数横].open = value;
          break;
        case 'bomb':
          elements[X + Y * cell数横].bomb = value;
          break;
        case 'flag':
          elements[X + Y * cell数横].flag = value;
          break;
        case 'color':
          elements[X + Y * cell数横].color = value;
          break;
      }
    }
  }

  function drawMinsweepercell() {
    for (let i = 0; i < cell数縦; i++) {
      for (let j = 0; j < cell数横; j++) {
        drawCell(j, i, 'None');
      }
    }
  }

  function drawRectangle(startX, startY, sizeX, sizeY, color) {
    let myPath = new Path();
    myPath = Shape.Rectangle(startX, startY, sizeX, sizeY);
    myPath.fillColor = color;
  }

  function drawCell(X, Y, color) {
    let cellColor
    let rectangle;
    switch (color) {
      case 'None':
        cellColor = 'darkgreen';
        rectangle = true;
        break;
      case 'highlight':
        cellColor = 'rgb(0,170,0)';
        rectangle = true;
        break;
      case 'openBack':
        cellColor = 'rgb(150,255,50)';
        rectangle = true;
        break;
      case 'open':
        rectangle = false;
        drawCell(X, Y, 'openBack')
        if (true) {
          let text = new PointText(X * cellSize + cellSize / 2, (Y + 1) * cellSize - cellSize * 0.1);
          text.justification = 'center';
          text.fontSize = cellSize;
          text.fillColor = 'black'
          if (out二次元配列(X, Y, 'around') !== 0) {
            text.content = out二次元配列(X, Y, 'around');
          }
        }
        break;
      case 'flag':
        rectangle = false;
        drawCell(X, Y, 'None')
        if (true) {
          let text = new PointText(X * cellSize + cellSize / 2, (Y + 1) * cellSize - cellSize * 0.1);
          text.justification = 'center';
          text.fontSize = cellSize;
          text.fillColor = "rgb(255,0,0)"
          text.content = 'P';
        }
        break;
      case 'bomb':
        cellColor = 'red';
        rectangle = true;
        break;
    }
    if (rectangle) {
      drawRectangle(X * cellSize, Y * cellSize, cellSize, cellSize, 'black');
      drawRectangle(X * cellSize + 0.5, Y * cellSize + 0.5, cellSize - 1, cellSize - 1, cellColor);
    }
  }

  function check(X, Y, button) {
    if (out二次元配列(X, Y, 'open') === false) {
      if (button === 1) {
        if (opened === 0) {
          bomb(X, Y);
        }
        if (out二次元配列(X, Y, 'flag')) {
          in二次元配列(X, Y, 'flag', false);
          drawCell(X, Y, 'None');
          in二次元配列(X, Y, 'color', 'None');
          putFlags--;
        } else {
          if (out二次元配列(X, Y, 'bomb')) {
            in二次元配列(X, Y, 'open', true);
            drawCell(X, Y, 'bomb');
            in二次元配列(X, Y, 'color', 'bomb');
            para1.textContent = 'ゲームオーバー';
            bomb_爆発();
            NewGame.innerHTML = '<input type="button" value="New Game" onClick="Newgame()">'
          } else {
            open(X, Y)
          }
        }
      } else {
        if (out二次元配列(X, Y, 'flag')) {
          in二次元配列(X, Y, 'flag', false);
          drawCell(X, Y, 'None');
          in二次元配列(X, Y, 'color', 'None');
          putFlags--;
        } else if (putFlags < bomb数) {
          in二次元配列(X, Y, 'flag', true);
          drawCell(X, Y, 'flag');
          in二次元配列(X, Y, 'color', 'flag');
          putFlags++;
        } else {
          alert('もう旗がありません')
        }
      }
      paraFlag.textContent = '残り🏴：' + (bomb数 - putFlags);
    }
  }

  function open(X, Y) {
    drawCell(X, Y, 'open');
    in二次元配列(X, Y, 'open', true);
    in二次元配列(X, Y, 'color', 'open');
    if (out二次元配列(X, Y, 'around') === 0) {
      for (let i = 0; i < around.length; i++) {
        if (out二次元配列(X + around[i][0], Y + around[i][1], 'open') === false) {
          open(X + around[i][0], Y + around[i][1])
        }
      }
    }
    opened++;
  }

  function bomb(X, Y) {
    for (let i = 0; i < bomb数;) {
      let bomb_pos = Math.floor(Math.random() * elements.length);
      let result;
      if (elements[bomb_pos].bomb === false) {
        if (bomb_pos !== X + Y * cell数横) {
          result = true;
          for (let j = 0; j < around.length; j++) {
            if (bomb_pos === X + around[j][0] + (Y + around[j][1]) * cell数横) {
              result = false;
              break;
            }
          }
        }
      }
      if (result) {
        elements[bomb_pos].bomb = true;
        i++;
      }
    }
    for (let i = 0; i < cell数縦; i++) {
      for (let j = 0; j < cell数横; j++) {
        if (out二次元配列(j, i, 'bomb')) {
          for (let k = 0; k < around.length; k++) {
            in二次元配列(j + around[k][0], i + around[k][1], 'around', out二次元配列(j + around[k][0], i + around[k][1], 'around') + 1);
          }
        }
      }
    }
  }

  function bomb_爆発() {
    for (let i = 0; i < cell数縦; i++) {
      for (let j = 0; j < cell数横; j++) {
        if (out二次元配列(j, i, 'bomb')) {
          drawCell(j, i, 'bomb');
          in二次元配列(j, i, 'color', 'bomb');
          in二次元配列(j, i, 'open', true)
        } else {
          in二次元配列(j, i, 'open', true);
        }
      }
    }
  }

  drawMinsweepercell();

  for (let i = 0; i < cell数横 * cell数縦; i++) {
    elements.push({ around: 0, open: false, bomb: false, flag: false, color: 'None' });
  }

  onmousedown = function (event) {
    if (device === 'pc') {
      if (event.path[0] === mainCanvas) {
        let X = Math.floor(event.layerX / cellSize);
        let Y = Math.floor(event.layerY / cellSize);
        let button = event.which;
        check(X, Y, button);
        if (opened >= cell数縦 * cell数横 - bomb数) {
          para1.textContent = 'ゲームクリア';
        }
      }
    } else if (event.path[0] === mainCanvas) {
      mouse = true;
      hundle = setTimeout(tup, 500, event);
    }
  }

  onmouseup = function (event) {
    if (device === 'other' && event.path[0] === mainCanvas) {
      mouse = false;
      if (hundle !== '') {
        this.clearTimeout(hundle);
      }
      if (hundle !== '') {
        let X = Math.floor(event.layerX / cellSize);
        let Y = Math.floor(event.layerY / cellSize);
        check(X, Y, 1);
      }
    }
  }

  onmousemove = function (event) {
    if (device === 'pc') {
      if (event.path[0] === mainCanvas) {
        let X = Math.floor(event.layerX / cellSize);
        let Y = Math.floor(event.layerY / cellSize);
        if (X !== X記憶 || Y !== Y記憶) {
          if (X記憶 >= 0 || Y記憶 >= 0) {
            if (out二次元配列(X記憶, Y記憶, 'open') === false && out二次元配列(X記憶, Y記憶, 'flag') === false) {
              drawCell(X記憶, Y記憶, 'None');
            }
            if (out二次元配列(X, Y, 'open') === false && out二次元配列(X, Y, 'flag') === false) {
              drawCell(X, Y, 'highlight');
            }
          }
          X記憶 = X;
          Y記憶 = Y;
        }
      } else {
        drawCell(X記憶, Y記憶, out二次元配列(X記憶, Y記憶, 'color'));
        X記憶 = -1;
        Y記憶 = -1;
      }
    }
  }

  function tup(event) {
    let X = Math.floor(event.layerX / cellSize);
    let Y = Math.floor(event.layerY / cellSize);
    check(X, Y, 3);
    hundle = '';
  }

});
