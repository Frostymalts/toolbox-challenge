//app.js: The main javascript file for this application

var flippedImg;
var misses = 0;
var remaining = 8;

var tiles = [];
var idx;
for (idx = 1; idx <= 32; idx++) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' +idx+ '.jpg',
        flipped: false
    });
}

$(document).ready(function() {
    //show main screen, hide game play
    $('#mainScreen').show();
    $('#gamePlay').hide();
    $('#gameOver').hide();

    $("#help").popover({
        placement:'bottom',
        title : 'To play click on the cards to see the picture they hide! Each turn you can flip two cards, if those two match' +
        ' then they stay flipped! To win match all the cards, good luck!'
    });

    //start button clicked
    $('#start-game').click(function() {
        $('#song').get(0).play();

        //clear board and reset
        var startTime = Date.now();
        setInterval(function(){
            console.log('inside timer');
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + (elapsedSeconds == 1 ? ' second': ' seconds'));
        }, 1000);
        setUpBoard();

        //a tile is clicked
        $('#game-board img').click(function () {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (!tile.flipped) {
                flipTile(tile, clickedImg);
                setTimeout(function () {
                    if (flippedImg == null) {
                        flippedImg = clickedImg;
                    } else {
                        var flippedTile = flippedImg.data('tile');
                        if (flippedTile.tileNum == tile.tileNum) {
                            remaining--;
                            $('#matches').text(8-remaining);
                            $('#remaining').text(remaining);
                            if(remaining == 0) {
                                $('#game-board').hide();
                                $('#gameOver').show();
                            };
                        } else {
                            flipTile(flippedTile, flippedImg);
                            flipTile(tile, clickedImg);
                            misses++;
                            $('#misses').text(misses);
                        }
                        flippedImg = null;
                    }
                }, 1000);
            }
        });
    });

    $('#playAgain').click(function() {
        setUpBoard();
    });

    $('#vol').click(function() {
        if ($('#song').get(0).paused) {
            $('#song').get(0).play();
        } else {
            $('#song').get(0).pause();
        }
    });
});

function setUpBoard(timer) {
    flippedImg = null;
    misses = 0;
    remaining = 8;

    $('#mainScreen').hide();
    $('#gameOver').hide();
    $('#gamePlay').show();
    $('#game-board').show();
    //set up tile array
    tiles = _.shuffle(tiles);
    var selectedTiles = tiles.slice(0, 8);
    var tilePairs = [];
    _.forEach(selectedTiles, function (tile) {
        tilePairs.push(tile);
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    //set up game board
    var gameBoard = $('#game-board');
    gameBoard.text('');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function (tile, elemIndex) {
        if (elemIndex > 0 && 0 == (elemIndex % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
    window.clearInterval(timer);

}

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}