"use strict";

let draw = (canvas, board) => {
    let ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;

    let ww = board.getCols(), hh = board.getRows();
    let dx = w / ww, dy = h / hh;
    let dx2 = dx / 2, dy2 = dy / 2;
    let rad = dx2 * 4 / 5;

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, w, h);

    let colors = {
        "0": "lightblue",
        "1": "red",
        "2": "yellow"
    };

    for (let row = 0; row < board.getRows(); row++) {
        for (let col = 0; col < board.getCols(); col++) {
            let c = board.getColorAt(row, col);

            ctx.fillStyle = colors["" + c];
            ctx.beginPath();
            ctx.arc(dx2 + dx * col, h - (dy2 + dy * row), rad, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
};

class Game {
    constructor(canvas, board, player1, player2) {
        this.canvas = canvas;
        this.board = board;
        this.player1 = player1;
        this.player2 = player2;
        // this.player = Math.random() < .5;
        this.player = false;
    }

    startTurn() {
        let player = this.player ? this.player1 : this.player2;
        let color = this.player ? 1 : 2;
        player.turn(this, this.board, color);
    }

    select(col) {
        let color = this.player ? 1 : 2;
        this.board.insert(col, color);

        draw(this.canvas, this.board);
        this.player = !this.player;

        let gs = this.board.checkGameState();

        if (gs == 1 || gs == 2) {
            this.gameOver(gs == 1 ? this.player1 : this.player2);

        } else if (this.board.getFreeCols().length > 0) {
            this.startTurn();
        } else {
            this.gameOver(null);
        }
    }

    gameOver(winner) {
        window.setTimeout(_ => {
            if (winner == null) {
                window.alert("it's a draw");
            } else {
                window.alert(winner.name + " wins");
            }
        }, 100);
    }
}

class HumanPlayer {

    constructor(canvas, name) {
        this.canvas = canvas;
        this.name = name;
    }

    turn(game, board, color) {
        let cl = e => {
            let x = e.offsetX;
            let w = this.canvas.width / board.getCols();
            let col = Math.floor(x / w);

            game.select(col);
            this.canvas.removeEventListener("click", cl);
        };

        this.canvas.addEventListener("click", cl);
    }
}

class MonteCarloBot {
    constructor(name, rounds) {
        this.name = name;
        this.worker = new Worker("MontyBot.js");
        this.rounds = rounds;
    }

    turn(game, board, color) {
        this.worker.onmessage = e => {
            game.select(e.data);
        };

        this.worker.postMessage({board: board, color: color, rounds : this.rounds});
      }
}


document.addEventListener("DOMContentLoaded", () => {
    let rounds = parseInt(new URL(window.location.href).searchParams.get("rounds"));
    if (isNaN(rounds))
        rounds = 1000;

    console.log("difficulty", rounds);

    let canvas = document.getElementById("canv");
    let board = new Board({rows: 6, cols: 7});

    let player1 = new HumanPlayer(canvas, "Monko");
    let player2 = new MonteCarloBot("Monty", rounds);

    let game = new Game(canvas, board, player1, player2);

    game.startTurn();

    draw(canvas, board);
});