(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Coord = SnakeGame.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.equals = function (coord2) {
    return (this.x == coord2.x) && (this.y == coord2.y);
  };

  Coord.prototype.isOpposite = function (coord2) {
    return (this.x == (-1 * coord2.x)) && (this.y == (-1 * coord2.y));
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.x + coord2.x, this.y + coord2.y);
  };

  var Mouse = SnakeGame.Mouse = function (board) {
    this.dir = "N";
    this.board = board;
    this.replace();
  };

  Mouse.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Mouse.prototype.move = function () {
    var newPos = this.position.plus(Mouse.DIFFS[this.dir]);
    if (this.validPos(newPos)) {
      if (!newPos.equals(this.board.snake.head().plus(Snake.DIFFS[this.board.snake.dir]))) {
        this.position = newPos;
      }
    }
    var z = Math.floor(Math.random()*4);
    if (z===0) {
      this.dir = "N";
    } else if (z===1) {
      this.dir = "W";
    } else if (z===2) {
      this.dir = "S";
    } else {
      this.dir = "E";
    }
  };

  Mouse.prototype.validPos = function (coord) {
    var result = true
    if (!this.board.validPosition(coord)) {
      result = false;
    } else {
      this.board.snake.segments.forEach(function (segment) {
        if (segment.equals(coord)) {
          result = false;
          return result;
        }
      })
    }
    return result;
  };

  Mouse.prototype.replace = function () {
    var i = Math.floor(Math.random() * this.board.dim);
    var j = Math.floor(Math.random() * this.board.dim);
    var coord = new Coord(i, j)
    while (!this.validPos(coord)) {
      i = Math.floor(Math.random() * this.board.dim);
      j = Math.floor(Math.random() * this.board.dim);
    }
    this.position = new Coord(i, j);
  };

  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "N";
    this.turning = false;
    this.board = board;
    var center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];
    this.growTurns = 0;
  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.SYMBOL = "S";
  Snake.GROW_TURNS = 3;

  Snake.prototype.eatMouse = function () {
    if (this.head().equals(this.board.mouse.position)) {
      this.growTurns += 3;
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;
    this.segments.forEach(function (segment) {
      if (segment.x === array[0] && segment.y === array[1]) {
        result = true;
        return result;
      }
    });

    return result;
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function () {
    var head = this.head();
    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (var z = 0; z < this.segments.length - 1; z++) {
      if (this.segments[z].equals(head)) {
        return false;
      }
    }
    return true;
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
    this.turning = false;
    if (this.eatMouse()) {
      this.board.mouse.replace();
    }
    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }
    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (dir) {
    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

  var Board = SnakeGame.Board = function (dim) {
    this.dim = dim;
    this.snake = new Snake(this);
    this.mouse = new Mouse(this);
    this.index = 0;
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function (dim) {
    var grid = [];
    for (var x = 0; x < dim; x++) {
      var row = [];
      for (var y = 0; y < dim; y++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }
    return grid;
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);
    this.snake.segments.forEach(function (segment) {
      grid[segment.x][segment.y] = Snake.SYMBOL;
    });
    grid[this.mouse.position.x][this.mouse.position.y] = Mouse.SYMBOL;

    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.x >= 0) && (coord.x < this.dim) &&
    (coord.y >= 0) && (coord.y < this.dim);
  };
})();
