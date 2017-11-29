var playerInTurn = "x";

var togglePlayer = function () {
    playerInTurn = playerInTurn === "x" ? "o" : "x";
};

var init = function() {
    initBoard();
    playMusic();
};

var playMusic = function() {
    music = new Audio("audio/game.mp3");
    music.play();
};

var initBoard = function () {
    document.board = {};

    $("div.cell").each(function () {
        $(this).removeClass("active");
        $(this).removeClass("o");
        $(this).removeClass("x");
        document.board[this.id] = 0;
    });

    document.tablero = [
        [
            {player: 0},
            {player: 0},
            {player: 0}
        ],
        [
            {player: 0},
            {player: 0},
            {player: 0}
        ],
        [
            {player: 0},
            {player: 0},
            {player: 0}
        ]
    ];
};

var sendBoard = function () {
    $.post(
            "jugar/juego.htm",
            {tablero: JSON.stringify(document.board)},
            function (serverResponse) {
                serverResponse = JSON.parse(serverResponse);

                if (serverResponse.status) {

                    idCell = serverResponse.cell;
                    cell = document.getElementById(idCell);

                    cellJson = {
                        row: $(cell).data("row"),
                        col: $(cell).data("col")
                    };

                    $(cell).data("player", playerInTurn);
                    $(cell).addClass("active " + playerInTurn);

                    document.tablero[cellJson.row][cellJson.col].player = cell.player;
                    document.board[idCell] = cell.player;

                    if (!checkGameWinner(cellJson)) {
                        // Change the player
                        togglePlayer();
                    } else {
                        alert("Gano: " + playerInTurn);
                        initBoard();
                    }

                }

            });
};

var checkGameWinner = function (cell) {

    length = document.tablero[0].length;
    rowToCheck = document.tablero[cell.row];
    colToCheck = document.tablero[cell.col];

    //First diagonal
    hits = 0;
    for (i = 0; i < length; i++) {
        if (document.tablero[i][i].player === cell.player)
            hits++;
    }
    if (hits === length)
        return true;

    //Second diagonal
    hits = 0;
    j = length - 1;
    for (i = 0; i < length; i++) {
        if (document.tablero[i][j].player === cell.player)
            hits++;
        j--;
    }
    if (hits === length)
        return true;

    // Check if all the row is filled with the current player coin
    hits = 0;
    for (i = 0; i < rowToCheck.length; i++) {
        if (rowToCheck[i].player === cell.player)
            hits++;
    }
    if (hits === length)
        return true;

    // Check if all the column is filles with the current player coin
    hits = 0;
    for (i = 0; i < colToCheck.length; i++) {
        if (colToCheck[i].player === cell.player)
            hits++;
    }
    if (hits === length)
        return true;

    return false;
};

$(".cell").click(function (evt) {

    element = evt.currentTarget;

    if ($(element).hasClass("active")) {
        return false;
    }

    $(element).data("player", playerInTurn);
    $(element).addClass("active " + playerInTurn);

    // Row and column
    cell = {
        row: $(element).data("row"),
        col: $(element).data("col"),
        player: playerInTurn === "x" ? 1 : 2
    };

    document.tablero[cell.row][cell.col].player = cell.player;
    document.board[element.id] = cell.player;

    //checkGameWinner(cell);

    if (!checkGameWinner(cell)) {
        togglePlayer();
        sendBoard();
    } else {
        alert("Gano: " + playerInTurn);
        initBoard();
    }
});

$(init());