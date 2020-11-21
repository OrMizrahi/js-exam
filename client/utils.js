const getBoardState = () => {
	let obj = {};
	// We will compose an object of all of the Xs and Ox
	// that are on the board
	document.querySelectorAll('.board button').forEach((btn) => {
		obj[btn.id] = btn.innerText || '';
	});
	return obj;
};

export const gameTied = () => {
	const state = getBoardState();
	return Object.keys(state).every((key) => state[key] !== '');
};

export const isGameOver = () => {
	const state = getBoardState();
	// One of the rows must be equal to either of these
	// value for
	// the game to be over
	const matches = ['XXX', 'OOO'];
	// These are all of the possible combinations
	// that would win the game
	const rows = [
		state.a0 + state.a1 + state.a2,
		state.b0 + state.b1 + state.b2,
		state.c0 + state.c1 + state.c2,
		state.a0 + state.b1 + state.c2,
		state.a2 + state.b1 + state.c0,
		state.a0 + state.b0 + state.c0,
		state.a1 + state.b1 + state.c1,
		state.a2 + state.b2 + state.c2,
	];

	// to either 'XXX' or 'OOO'
	for (let i = 0; i < rows.length; i++) {
		if (rows[i] === matches[0] || rows[i] === matches[1]) {
			return true;
		}
	}
};

export const renderTurnMessage = (myTurn) => {
	// Disable the board if it is the opponents turn
	const messages = document.getElementById('messages');

	if (!myTurn) {
		messages.innerText = "Your opponent's turn.";
		disbaleButtons();
		// Enable the board if it is your turn
	} else {
		messages.innerText = 'Your turn.';
		enableButtons();
	}
};

export const makeMove = (e, symbol, myTurn, socket) => {
	e.preventDefault();
	const target = e.target;

	// It's not your turn or clicked on checked space
	if (!myTurn || target.innerText.length) {
		return;
	}

	// Emit the move to the server
	socket.emit('make.move', {
		symbol: symbol,
		position: target.id,
	});
};

const enableButtons = () => {
	const buttons = document.querySelectorAll('.board button');
	buttons.forEach((btn) => {
		btn.disabled = false;
	});
};

export const disbaleButtons = () => {
	const buttons = document.querySelectorAll('.board button');
	buttons.forEach((btn) => {
		btn.disabled = true;
	});
};
