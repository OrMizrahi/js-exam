import express from 'express';
import path from 'path';
import http from 'http';
import SocketIO from 'socket.io';
import GameEvent from './Game.js';

const app = express();
app.use(express.static('client'));

const server = http.createServer(app);
const io = new SocketIO(server);

const port = process.env.PORT || 5000;
server.listen(port);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, './client/index.html'));
});

let game = new GameEvent();

io.sockets.on('connection', function (socket) {
	socket.emit('connect', { msg: 'hello' });
	game.joinGame(socket);

	if (game.getOpponent(socket)) {
		socket.emit('game.begin', {
			symbol: game.getPlayers()[socket.id].symbol,
		});
		game.getOpponent(socket).emit('game.begin', {
			symbol: game.getPlayers()[game.getOpponent(socket).id].symbol,
		});
	}

	socket.on('make.move', function (data) {
		if (!game.getOpponent(socket)) {
			return;
		}
		socket.emit('move.made', data);
		game.getOpponent(socket).emit('move.made', data);
	});

	socket.on('disconnect', function () {
		let opponent = game.getOpponent(socket);
		if (opponent) {
			opponent.emit('opponent.left');
		}
	});
});
