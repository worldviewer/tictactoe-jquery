$(document).ready(function() {

	// Initialize Console.js, which just makes console logs a bit easier to read.

	// INSTRUCTIONS ON USING console.js
	// Step 1: override console methods and enable String.prototype styles
	Console.attach();
	Console.styles.attach();

	// Step 2: register your styles
	Console.styles.register({
	    bold: 'font-weight:bold',
	    underline: 'text-decoration:underline',

	    red: 'color:#de4f2a',
	    blue: 'color:#1795de',
	    green: 'color:green',
	    grey: 'color:grey',

	    code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
	});

	// test out console.log.bind()
	var info = console.log.bind(console, '\nINFO:');
	var warn = console.warn.bind(console, '\nWARN:');
	var error = console.error.bind(console, '\nERROR: ');
	var testing = console.log.bind(console, '\nTEST:'.underline.bold.green + ' ');

	// TIC TAC TOE CODE BEGINS HERE

	// Refactor: converts row & column to a jQuery DOM element
	var getBox = function (row, column) {

		var id = '';

		// Convert semantic CSS id's into numeric array format
		switch(row){
			case 0:
				id = 'top';
				break;
			case 1:
				id = 'middle';
				break;
			case 2:
				id = 'bottom';
				break;
		}

		switch(column){
			case 0:
				id += '-left';
				break;
			case 1:
				id += '-middle';
				break;
			case 2:
				id += '-right';
				break;
		}

		// Refactor: return document.getElementById(id) 
		return $('#'+ id);
	};

	// converts a text-based tile ID into HTML semantic row
	var getRow = function (id) {
		switch(id.split('-')[0]){
			case 'top':
				return 0;
			case 'middle':
				return 1;
			case 'bottom':
				return 2;
		}
	}

	// converts a text-based tile ID into HTML semantic column
	var getColumn = function (id) {
		switch(id.split('-')[1]){
			case 'left':
				return 0;
			case 'middle':
				return 1;
			case 'right':
				return 2;
		}
	}

	// returns the current state for a row/column combination
	var getState = function (row, column) {
		switch(tictactoe[row][column]['state']){
			case 'none':
				return 0;
			case 'x':
				return 1;
			case 'o':
				return -1;
		}
	}

	var makeGame = function () {
		// First, grab references to all of the elements, and place them into
		// an array of three rows.  Each row is represented by an array of
		// 3 columns.  So, to reference a particular box, use:
		//
		// board[x][y];

		var board = [[{id:getBox(0,0), state:'none'},
					  {id:getBox(0,1), state:'none'},
					  {id:getBox(0,2), state:'none'}],

					 [{id:getBox(1,0), state:'none'},
					  {id:getBox(1,1), state:'none'},
					  {id:getBox(1,2), state:'none'}],

					 [{id:getBox(2,0), state:'none'},
					  {id:getBox(2,1), state:'none'},
					  {id:getBox(2,2), state:'none'}]];

		testing(board[0][0]['id']); // testing array structure
		testing(board[1][2]['id']); // testing array structure

		// Next, make each box clickable
		// Refactor: var boxes = document.getElementsByClassName('box');
		var $boxes = $('.box');
		// Refactor: for (var i = 0; i < $boxes.length; i++) {
		// jQuery does not require a loop to cycle through all of the
		// box class elements

			// info(boxes[i]);

			// boxes[i].addEventListener('click', function(e) {
			$boxes.on('click', function(e) {
				// Test the Event Listener ...
				// Store the target's ID into a variable
				var target = e.target.id;

				testing("clicked " + target);

				// When a board box is pressed, make a move based upon the current
				// state -- but only if there is no winner
				if (!isWinner()) {
					switch(board[getRow(target)][getColumn(target)]['state']){
						case 'none':
							testing('state is none, changing state');
							makeMove(getRow(target), getColumn(target), move);
							break;
						case 'x':
							// Do nothing, because this box is already checked
							testing('state is already x!');
							break;
						case 'o':
							// Do nothing, because this box is already checked
							testing('state is already o!');
							break;
						default:
							testing('something went wrong!');
							break;
					}
				}
			});
		// Refactor: };

		// Now, set up the Reset button
		// Refactor: document.getElementById("reset").addEventListener('click', resetGame);
		$('#reset').on('click', resetGame);

		return board;
	};

	var resetGame = function () {
		info("Reseting Game ...");

		// Clear out states on board
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				tictactoe[i][j]['state'] = 'none';
			};
		};

		// Reset the box styles
		// Refactor: var boxes = document.getElementsByClassName('box');
		var $boxes = $('.box');

		// for (var i = 0; i < boxes.length; i++) {
			// Refactor: boxes[i].className = 'box';
		// }
		$boxes.removeClass('x o');

		// Reset move and move message
		move = 'x';

		// Refactor document.getElementById('move').innerHTML = "(It is " + move + "'s turn ...)";
		$('#move').html("(It is " + move + "'s turn ...)");

		// Refactor: document.getElementById('message').className = "";
		$('#message').removeClass('win');

		// Refactor: document.getElementById('win').className = "";
		$('#win').removeClass('fadeIn');
	};

	var makeMove = function (row, column, player) {
		// makeMove assumes that the state is set to 'none'
		// Refactor: getBox should now return a jQuery object ...
		var $box = getBox(row, column);
		testing($box);

		// Set the clicked box to either 'x' or 'o', based upon current player
		// This has been disabled, since I'm now using graphics for the x's and o's
		// box.innerHTML = player;

		// Set the CSS for the box
		// Refactor: box.className += ' ' + player;
		$box.addClass(player);

		// Change box's state
		tictactoe[row][column]['state'] = player;

		// Check to see if there's a winner
		var winner = isWinner();
		if(winner) {

			// Refactor: document.getElementById('move').innerHTML = winner.toUpperCase() +
			  " HAS WON!";
			$('#move').html(winner.toUpperCase() + " HAS WON!");

			// Refactor: document.getElementById('message').className += " win";
			$('#message').addClass('win');

			// Refactor: document.getElementById('win').className = "fadeIn";
			$("#win").addClass('fadeIn');
		} else {
			// Alternate the current move
			move = (player === 'o') ? 'x' : 'o';

			// Change turn message
			// Refactor: document.getElementById('move').innerHTML = "(It is " + move + "'s turn ...)";
			$('#move').html("(It is " + move + "'s turn ...)");
		}
	};

	// Checks to see if any of the array sums are either 3 or -3
	var three = function (arr) {
		var isWinner = 'false';
		var winner = 'none';

		for (var i = 0; i < arr.length; i++) {
			if (Math.abs(arr[i]) === 3) {
				return { isWinner:true, winner:((arr[i] === 3) ? 'x' : 'o') }
			}
		};

		return { isWinner:false, winner:'none' };
	}

	var isWinner = function () {
		// There are 8 total ways to win for each player.  To check for victory, add
		// 1 to checkWin for 'x', subtract 1 for 'o'

		// Check the row sums
		var rowSums = [getState(0,0) + getState(0,1) + getState(0,2),
					   getState(1,0) + getState(1,1) + getState(1,2),
					   getState(2,0) + getState(2,1) + getState(2,2)];

		// Check the columns
		var columnSums = [getState(0,0) + getState(1,0) + getState(2,0),
					   	  getState(0,1) + getState(1,1) + getState(2,1),
					      getState(0,2) + getState(1,2) + getState(2,2)];


		// Check the diagonals
		var diagonalSums = [getState(0,0) + getState(1,1) + getState(2,2),
					  		getState(0,2) + getState(1,1) + getState(2,0)]

		// Check all array sums for -3 or 3
		if (three(rowSums)['isWinner']) {
			info('Winner: ' + three(rowSums)['winner'])
			return three(rowSums)['winner'];
		}

		if (three(columnSums)['isWinner']) {
			info('Winner: ' + three(columnSums)['winner'])
			return three(columnSums)['winner'];
		}

		if (three(diagonalSums)['isWinner']) {
			info('Winner: ' + three(diagonalSums)['winner'])
			return three(diagonalSums)['winner'];
		}
	}

	var move = 'x'; // Initialize first move to 'x'
	var tictactoe = makeGame(); // Set up board
});
