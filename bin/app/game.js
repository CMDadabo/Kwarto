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

var Piece = function (id, big, dark, square, solid) {
	'use strict';
	this.big = big;
	this.dark = dark;
	this.square = square;
	this.solid = solid;
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

var pieces = [];

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
	console.log("Sideboard full")
};


var draw_sideboard = function () {
	'use strict';
	for (var i = 0; i<pieces.length; i++) {
		$('.sideboard').append(pieces[i].$pieceDiv);
		console.log("Drawing piece id=" + i);
	}
};

// Initialize game
$(document).ready(function () {
	create_board();
	fill_sideboard();
	draw_sideboard();

	// Main loop
	while (!game_over){
		if (current_turn == TURN_AI) {
			var random_choice = Math.floor(Math.random()*16);
			choose_piece( $( '#' + random_choice ) );
			current_turn == TURN_PLAYER; }
		// } else if (current_turn == TURN_PLAYER) {
		// 	$('.board_space').click( function () {
		// 		$'.chosen'.hide
		// 	})
		// 	game_over = true;
		// };
	};

});