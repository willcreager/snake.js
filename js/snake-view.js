(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el) {
    this.$el = $el;
    this.board = new SnakeGame.Board(20);
    this.setupGrid();
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.KEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.STEP_MILLIS = 100;

  View.prototype.handleKeyEvent = function (event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    } else {
      // some other key was pressed; ignore.
    }
  };

  View.prototype.render = function () {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.mouse.position], "mouse");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();
    coords.forEach(function(coord){
      var flatCoord = (coord.x * this.board.dim) + coord.y;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";
    for (var x = 0; x < this.board.dim; x++) {
      html += "<ul>";
      for (var y = 0; y < this.board.dim; y++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      if (this.board.index % 2 === 0) {
        this.board.mouse.move();
      }
      this.render();
      this.board.index += 1;
    } else {
      alert("Sorry, you lost! :(");
      window.clearInterval(this.intervalId);
    }
  };
})();
