// Set game state var and constants
var game_state = "";
var AI_PICK = 0;
var AI_PLAY = 1;
var PLAYER_PICK = 2;
var PLAYER_PLAY = 3;

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
	'use strict';

	// Board-related variables
	var lines = {};
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

		var pieces_to_check = [];

		for (var i = 0; i < 4 ; i++) {
			var p = board["space_" + line[i]];
			if (board.hasOwnProperty('space_' + line[i])) {
				pieces_to_check.push(p);
				// console.log("Pushing " + p + " from [space_" + line[i] + "]");
			}
		}
		// console.log(pieces_to_check);
		// console.log(pieces_to_check[0].attrs);
		if (pieces_to_check.length === 4) {
			for (var j = 0; j < 4 ; j++){
				if (pieces_to_check[0].attrs[j] === pieces_to_check[1].attrs[j] &&
					pieces_to_check[1].attrs[j] === pieces_to_check[2].attrs[j] &&
					pieces_to_check[2].attrs[j] === pieces_to_check[3].attrs[j]) {
					return true;
			}
		}
		return false;
	}

	this.space_empty = function (ID) {
		return !this.hasOwnProperty("space_" + ID);
	};

};

this.check_win = function () {
	for (var line_name in lines) {
			// console.log(line_name);
			if (this.check_line(lines[line_name])) { return true; }
		}
		return false;
	};
};


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


var get_piece_by_ID = function (ID) {
	console.log("Searching for piece " + ID + " in remaining_pieces...");
	for (var i = 0; i<remaining_pieces.length; i++){
		if (remaining_pieces[i].ID == ID) {
			console.log("Piece " + ID + " returned.");
			return remaining_pieces[i];
		}
	}
};

var remove_from_remaining = function (ID) {

};

var choose_piece = function ($piece) {
	'use strict';
	$piece.addClass('chosen');
};

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
	'use strict';
	game_state = AI_PICK;
	console.log("Game won: " + board.check_win());
	var random_choice = Math.floor(Math.random()*remaining_pieces.length);
	choose_piece( $( '#' +  remaining_pieces[random_choice].ID) );
	console.log("Piece " + random_choice + " chosen.");
	player_place_piece();
};

var player_place_piece = function () {
	'use strict';
	game_state = PLAYER_PLAY;
	console.log("Choose where to place this piece.");
	$('.board_space').click( function () {
		if (!$( this ).children().hasClass('piece') && game_state == PLAYER_PLAY) {
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
			}
			player_pick_piece();
		}
	});
	$('.board_space').hover(
		function () {
			if (game_state == PLAYER_PLAY) { $(this).addClass('board_space_hover'); }
		},
		function () {
			$(this).removeClass('board_space_hover');
		}
	);
};

var player_pick_piece = function () {
	game_state = PLAYER_PICK;
	console.log("Choose which piece your opponent must place.");
	$('.sideboard > .piece').hover(
		function () {
			if (game_state == PLAYER_PICK) {$(this).addClass('hoverglow');}
		},
		function () {
			if (game_state == PLAYER_PICK) {$(this).removeClass('hoverglow');}
		}
	);
	$('.sideboard > .piece').click(
		function () {
			if (game_state == PLAYER_PICK) {
				$(this).removeClass('hoverglow');
				var piece_ID = $(this).attr('id');
				chosen_piece = get_piece_by_ID(piece_ID);
				ai_play_piece();
			}
		});
};

var chosen_piece = null;

var ai_play_piece = function () {
	game_state = AI_PLAY;
	console.log("AI is playing...");

	var chosen_space = null;
	var space_found = false;
	while (!space_found) {
		console.log("AI searching...");
		chosen_space = Math.floor(Math.random()*16);
		if (board.space_empty(chosen_space)) {
			$('#space_' + chosen_space).append(chosen_piece.$pieceDiv)
			space_found = true;
			ai_pick_piece();
		}
	}	
};

var board = new Board();

// Initialize game
$(document).ready(function () {
	'use strict';
	create_board();
	fill_sideboard();
	draw_sideboard();

	// Main loop
	ai_pick_piece();
});