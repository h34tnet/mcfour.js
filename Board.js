"use strict";

class Board {
    constructor(config) {
        this.rows = config.rows;
        this.cols = config.cols;

        if ("board" in config) {
            this.board = config.board.slice(0);
        } else {
            this.board = [];
            this.board.length = this.rows * this.cols;
            this.board.fill(0, 0, this.rows * this.cols);
        }
    }

    getRows() {
        return this.rows;
    }

    getCols() {
        return this.cols;
    }

    getColorAt(row, col) {
        if (row < 0 || row >= this.getRows() || col < 0 || col > this.getCols())
            throw "Illegal access at r" + row + "/c" + col;

        return this.board[row * this.cols + col];
    }

    getFreeCols() {
        let res = [];
        for (let c = 0; c < this.getCols(); c++) {
            if (this.getFreeCellAt(c) != -1)
                res.push(c);
        }

        return res;
    }

    getFreeCellAt(col) {
        for (let row = 0; row < this.rows; row++) {
            if (this.board[row * this.cols + col] == 0) {
                return row;
            }
        }

        return -1;
    }

    insert(col, color) {
        let row = this.getFreeCellAt(col);

        if (row > -1) {
            this.board[row * this.cols + col] = color;
        }
    }

    // returns 0 for not-yet-ended or 1/2 for the respective player
    checkGameState() {
        let rr = this.getRows(), cc = this.getCols();

        for (let r = 0; r < rr - 3; r++) {
            for (let c = 0; c < cc; c++) {
                let c0 = this.getColorAt(r + 0, c);
                let c1 = this.getColorAt(r + 1, c);
                let c2 = this.getColorAt(r + 2, c);
                let c3 = this.getColorAt(r + 3, c);

                if (c0 != 0 && c0 == c1 && c0 == c2 && c0 == c3)
                    return c0;
            }
        }

        for (let r = 0; r < rr; r++) {
            for (let c = 0; c < cc - 3; c++) {
                let c0 = this.getColorAt(r, c + 0);
                let c1 = this.getColorAt(r, c + 1);
                let c2 = this.getColorAt(r, c + 2);
                let c3 = this.getColorAt(r, c + 3);

                if (c0 != 0 && c0 == c1 && c0 == c2 && c0 == c3)
                    return c0;
            }
        }

        for (let r = 0; r < rr - 3; r++) {
            for (let c = 0; c < cc - 3; c++) {
                let c0 = this.getColorAt(r + 0, c + 0);
                let c1 = this.getColorAt(r + 1, c + 1);
                let c2 = this.getColorAt(r + 2, c + 2);
                let c3 = this.getColorAt(r + 3, c + 3);

                if (c0 != 0 && c0 == c1 && c0 == c2 && c0 == c3)
                    return c0;
            }
        }

        for (let r = 0; r < rr - 3; r++) {
            for (let c = 0; c < cc - 3; c++) {
                let c0 = this.getColorAt(r + 3, c + 0);
                let c1 = this.getColorAt(r + 2, c + 1);
                let c2 = this.getColorAt(r + 1, c + 2);
                let c3 = this.getColorAt(r + 0, c + 3);

                if (c0 != 0 && c0 == c1 && c0 == c2 && c0 == c3)
                    return c0;
            }
        }

    }
}