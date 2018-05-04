importScripts("Board.js");

onmessage = e => {
    let board = new Board(e.data.board);
    let mycolor = e.data.color;
    let rounds = e.data.rounds;

    let availableColumns = board.getFreeCols();

    // select one per random
    if (rounds <= 0) {
        // random!
        let col = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        postMessage(col);

    } else {
        // monte carlo method
        let res = availableColumns.map(c => {
            let score = playRandomGames(board, c, mycolor, rounds)
                .map(r => r === 0 ? 0 : (mycolor === r ? 1 : -1))
                .reduce((a, b) => a + b);

            return { col: c, score: score }
        });

        let best = res.reduce((acc, cv) => cv.score > acc.score ? cv : acc);

        postMessage(best.col);
    }
}

let playRandomGames = (board, column, color, games) => {
    let results = [];

    for (let i = 0; i < games; i++) {
        let nb = clone(board);
        nb.insert(column, color);
        results.push(playRandomGame(nb, getOpponentColor(color)));
    }

    return results;
}

let clone = board => {
    return new Board(board);
}

let playRandomGame = (board, color) => {
    while (true) {
        // select one per random
        let availableColumns = board.getFreeCols();

        if (availableColumns.length == 0)
            return 0;

        let col = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        board.insert(col, color);

        let state = board.checkGameState();
        if (state > 0)
            return state;

        color = getOpponentColor(color);
    }
}

let getOpponentColor = color => color == 1 ? 2 : 1;