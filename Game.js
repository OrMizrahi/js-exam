export default class Game {
	constructor() {}
	waitingPlayer = null;
	players = {};

	joinGame = (socket) => {
		this.players[socket.id] = {
			opponent: this.waitingPlayer,
			symbol: 'X',
			// The socket that is associated with this player
			socket: socket,
		};
		if (this.waitingPlayer) {
			this.players[socket.id].symbol = 'O';
			this.players[this.waitingPlayer].opponent = socket.id;
			this.waitingPlayer = null;
		} else {
			//set current waiting player to myself
			this.waitingPlayer = socket.id;
		}
	};

	getOpponent = (socket) => {
		if (!this.players[socket.id].opponent) {
			return;
		}
		return this.players[this.players[socket.id].opponent].socket;
	};

	getPlayers = () => {
		return this.players;
	};
}
