import {
	makeMove,
	isGameOver,
	gameTied,
	renderTurnMessage,
	disbaleButtons,
} from './utils.js';

const socket = io();
let symbol;
let myTurn;

//shared elements
const messages = document.getElementById('messages');

//disable all buttons at the start
disbaleButtons();

//add event handler for clicking the tiles
document.querySelectorAll('.board > button').forEach((btn) => {
	btn.addEventListener('click', (e) => makeMove(e, symbol, myTurn, socket));
});

// Set up the initial state when the game begins
socket.on('game.begin', (data) => {
	// The server will asign X or O to the player
	symbol = data.symbol;
	// Give X the first turn
	myTurn = symbol === 'X';
	renderTurnMessage(myTurn);
});

// Event is called when either player makes a move
socket.on('move.made', (data) => {
	// Render the move
	document.getElementById(data.position).innerText = data.symbol;
	myTurn = data.symbol !== symbol;

	// If the game is still going, show who's turn it is
	if (!isGameOver()) {
		if (gameTied()) {
			messages.innerText = 'Game Drawn!';
			disbaleButtons();
		} else {
			renderTurnMessage(myTurn);
		}
		// If the game is over
	} else {
		// Show the message for the loser
		if (myTurn) {
			messages.innerText = 'Game over. You lost.';
			// Show the message for the winner
		} else {
			messages.innerText = 'Game over. You won!';
			confetti(messages);
		}
		// Disable the board
		disbaleButtons();
	}
});

// Disable the board if the opponent leaves
socket.on('opponent.left', () => {
	messages.innerText = 'Your opponent left the game.';
	disbaleButtons();
});
