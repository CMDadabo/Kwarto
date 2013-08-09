var TURN_PLAYER = 1;
var TURN_AI = 0;

var game_over = false;
var current_turn = TURN_AI;

var create_board = function () {
	'use strict';
	var space_size = ($(".board").width() - 45 - 4 * 6) / 4, i = 0;
	for (i = 0; i < 16; i++){
		$('.board').append('<div class="board_space" id="space_' + i + '"></div>');
	}
	$(".board_space").width(space_size);
	$(".board_space").height(space_size);
};

var Board = function () {
	// Board-related variables
	var lines = new Object();
	lines.col1 = [0,4,8,12];
	lines.col2 = [1,5,9,13];
	lines.col3 = [2,6,10,14];
	lines.col4 = [3,7,11,15];

	lines.row1 = [0,1,2,3];
	lines.row2 = [4,5,6,7];
	lines.row3 = [8,9,10,11];
	lines.row4 = [12,13,14,15];

	lines.diag1 = [0,5,10,15];
	lines.diag2 = [3,6,9,12];

	this.check_line = function (line) {

		var pieces_to_check = new Array();

		for (var i = 0; i < 4 ; i++) {
			var p = board["space_" + line[i]];
			if (board.hasOwnProperty('space_' + line[i])) {
				pieces_to_check.push(p);
				// console.log("Pushing " + p + " from [space_" + line[i] + "]");
			};
		}
		// console.log(pieces_to_check);
		// console.log(pieces_to_check[0].attrs);
		if (pieces_to_check.length == 4) {
			for (var i = 0; i < 4 ; i++){
				if (pieces_to_check[0].attrs[i] == pieces_to_check[1].attrs[i] &&
					pieces_to_check[1].attrs[i] == pieces_to_check[2].attrs[i] &&
					pieces_to_check[2].attrs[i] == pieces_to_check[3].attrs[i]) {
				return true;
				}
			}
		}
		return false;
	};

	this.check_win = function () {
		for (line_name in lines) {
			// console.log(line_name);
			if (this.check_line(lines[line_name])) { return true };
		}
		return false;
	};
}


var Piece = function (id, big, dark, square, solid) {
	'use strict';
	this.big = big;
	this.dark = dark;
	this.square = square;
	this.solid = solid;
	this.ID = id.toString();
	this.attrs = [this.big, this.dark, this.square, this.solid];
	this.$pieceDiv = $('<div class="piece" id="' + id + '"></div>');

	// Size
	if (big) {
		this.$pieceDiv.addClass('p_big');
	} else {
		this.$pieceDiv.addClass('p_small');
	}

	// Color
	if (dark) {
		this.$pieceDiv.addClass('p_dark');
	} else {
		this.$pieceDiv.addClass('p_light');
	}

	// Shape
	if (square) {
		this.$pieceDiv.addClass('p_square');
	} else {
		this.$pieceDiv.addClass('p_circle');
	}

	// Solid
	if (!solid) {
		var $hole = $('<div class="hole"></div>');
		$hole.css("margin", (this.$pieceDiv.width()-30)/2);
		this.$pieceDiv.append($hole);
	}
};

var choose_piece = function ($piece) {
	'use strict';
	$piece.addClass('chosen');
};

// var place_piece = function (targetSquare, pieceID) {
// 	'use strict';
// 	$( this ).append( $('#' + pieceID) );
// 	$('.chosen').removeClass('chosen');
// 	ai_turn();
// };

var pieces = [];
var remaining_pieces = [];

var fill_sideboard = function () {
	'use strict';
	pieces.push(new Piece(0, true, true, true, true));
	pieces.push(new Piece(1, false, true, true, true));
	pieces.push(new Piece(2, true, false, true, true));
	pieces.push(new Piece(3, false, false, true, true));
	pieces.push(new Piece(4, true, true, false, true));
	pieces.push(new Piece(5, false, true, false, true));
	pieces.push(new Piece(6, true, false, false, true));
	pieces.push(new Piece(7, false, false, false, true));
	pieces.push(new Piece(8, true, true, true, false));
	pieces.push(new Piece(9, false, true, true, false));
	pieces.push(new Piece(10, true, false, true, false));
	pieces.push(new Piece(11, false, false, true, false));
	pieces.push(new Piece(12, true, true, false, false));
	pieces.push(new Piece(13, false, true, false, false));
	pieces.push(new Piece(14, true, false, false, false));
	pieces.push(new Piece(15, false, false, false, false));
	console.log("Sideboard full");
	remaining_pieces = pieces;
};

var draw_sideboard = function () {
	'use strict';
	for (var i = 0; i<pieces.length; i++) {
		$('.sideboard').append(pieces[i].$pieceDiv);
	}
};

var ai_pick_piece = function () {
	console.log("Game won: " + board.check_win());
	var random_choice = Math.floor(Math.random()*remaining_pieces.length);
	choose_piece( $( '#' +  remaining_pieces[random_choice].ID) );
	console.log("Piece " + random_choice + " chosen.");
	console.log("Choose where to place this piece.");
}

var player_place_piece = function () {
	$('.board_space').click( function () {
		if (!$( this ).children().hasClass('piece')) {
			$( this ).append( $('.chosen') );
			var target_square = $( this ).attr('id');
			console.log(target_square);

			var placed_id = $('.chosen').attr('id');
			console.log("Piece " + placed_id + " placed.");
			$('.chosen').removeClass('chosen');

			for (var i = 0; i<remaining_pieces.length; i++){
				if (remaining_pieces[i].ID === placed_id) {
					board[target_square] = remaining_pieces.splice(i, 1)[0];
					console.log("Piece " + placed_id + " removed from remaining_pieces array.");
				}
			};
			ai_pick_piece();
		} else { console.log ( "Space occupied." ) };

	});
};

var player_pick_piece = function () {
	$
}

var board = new Board();

// Initialize game
$(document).ready(function () {
	create_board();
	fill_sideboard();
	draw_sideboard();

	// Main loop
	ai_pick_piece();
	player_place_piece();
});