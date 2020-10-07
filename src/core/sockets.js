


module.exports = (httpServer) => {
	const io = require('socket.io')(httpServer);

	io.on('connection', socket => {
		socket.on('join-room', (roomId, userId) => {
			console.log('join-room', {roomId, userId})
			socket.join(roomId)
			socket.to(roomId).broadcast.emit('user-connected', userId);
			// messages
			socket.on('message', (message) => {
				//send message to the same room
				io.to(roomId).emit('createMessage', message)
			});
	
			socket.on('disconnect', () => {
				socket.to(roomId).broadcast.emit('user-disconnected', userId)
			})
		})
	})

	return io;
}























// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	const users = {};

// 	const socketToRoom = {};

// 	io.on('connection', socket => {
// 		socket.on("join room", roomID => {
// 			console.log('join room', roomID)
// 			if (users[roomID]) {
// 				const length = users[roomID].length;
// 				if (length === 4) {
// 					socket.emit("room full");
// 					return;
// 				}
// 				users[roomID].push(socket.id);
// 			} else {
// 				users[roomID] = [socket.id];
// 			}
// 			socketToRoom[socket.id] = roomID;
// 			const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

// 			socket.emit("all users", usersInThisRoom);
// 		});

// 		socket.on("sending signal", payload => {
// 			console.log('sending signal')
// 			io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
// 		});

// 		socket.on("returning signal", payload => {
// 			io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
// 		});

// 		socket.on('disconnect', () => {
// 			const roomID = socketToRoom[socket.id];
// 			let room = users[roomID];
// 			if (room) {
// 				room = room.filter(id => id !== socket.id);
// 				users[roomID] = room;
// 			}
// 		});

// 	});

// }


























// const { addUser, getUsersInRoom, removeUser, removeUserById } = require('./usersSocket');


// const roomLeaveHelper = (socket, io, leave) => {
// 	const user = removeUser(socket.id);

// 	if (user) {
// 		socket.leave(user.socketId);

// 		console.log(`${user.fullname} has left!`)
// 		// io.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has left!`);

// 		// Отправляем всем в комнате, кроме себя
// 		// socket.broadcast.to(user.room).emit('ROOM:USERS_INFO', {
// 		// 	room: user.room,
// 		// 	users: getUsersInRoom(user.room)
// 		// });

// 		// Отправляем всем в комнате, кроме себя
// 		socket.broadcast.to(user.roomId).emit('ROOM:REMOVE_USER', user);
// 	}
// }


// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	io.on('connection', socket => {
// 		console.log('New socket connection');

// 		socket.on('ROOM:JOIN', ({ roomId, fullname, userId, signal }, callback) => {
// 			// if (!room) return;
// 			const { error, user } = addUser({ socketId: socket.id, roomId, fullname, userId, signal });

// 			if (error) {
// 			    return callback(error);
// 			}
		
// 			socket.join(user.roomId); 
		
// 			// socket.emit('ROOM:INFO_MESSAGE', 'Welcome!'); 
// 			// socket.broadcast.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has joined!`);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
			
// 			// //Когда присоединился новый пользователь, отправляем список всех пользователей всем в комнате
// 			// io.to(user.room).emit('ROOM:USERS_INFO', {	
// 			// 	room: user.room,
// 			// 	users: getUsersInRoom(user.room)
// 			// });


// 			// socket.broadcast.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has joined!`);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
// 			socket.broadcast.to(user.roomId).emit('ROOM:NEW_USER', user);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
			
// 			//Отправляю только текущему пользователю список всех в комнате
// 			socket.emit('ROOM:USERS_INFO', {
// 				room: user.roomId,
// 				users: getUsersInRoom(user.roomId)
// 			});
		
// 			callback();
// 		});

// 		socket.on('ROOM:LEAVE', (userId) => {
// 			roomLeaveHelper(socket, io, 'leave');
// 		})

// 		socket.on('disconnect', () => {
// 			roomLeaveHelper(socket, io);
// 		});


// 	})

// 	return io;
// }























// const { addUser, getUsersInRoom, removeUser, removeUserById } = require('./usersSocket');


// const roomLeaveHelper = (socket, io, leave) => {
// 	const user = removeUser(socket.id);

// 	if (user) {
// 		socket.leave(user.socketId);

// 		console.log(`${user.fullname} has left!`)
// 		// io.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has left!`);

// 		// Отправляем всем в комнате, кроме себя
// 		// socket.broadcast.to(user.room).emit('ROOM:USERS_INFO', {
// 		// 	room: user.room,
// 		// 	users: getUsersInRoom(user.room)
// 		// });

// 		// Отправляем всем в комнате, кроме себя
// 		socket.broadcast.to(user.roomId).emit('ROOM:REMOVE_USER', user);
// 	}
// }


// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	io.on('connection', socket => {
// 		console.log('New socket connection');

// 		socket.on('ROOM:JOIN', ({ roomId, fullname, userId }, callback) => {
// 			// if (!room) return;
// 			const { error, user } = addUser({ socketId: socket.id, roomId, fullname, userId });

// 			if (error) {
// 			    return callback(error);
// 			}
		
// 			socket.join(user.roomId); 
		
// 			// socket.emit('ROOM:INFO_MESSAGE', 'Welcome!'); 
// 			// socket.broadcast.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has joined!`);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
			
// 			// //Когда присоединился новый пользователь, отправляем список всех пользователей всем в комнате
// 			// io.to(user.room).emit('ROOM:USERS_INFO', {	
// 			// 	room: user.room,
// 			// 	users: getUsersInRoom(user.room)
// 			// });


// 			// socket.broadcast.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has joined!`);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
// 			socket.broadcast.to(user.roomId).emit('ROOM:NEW_USER', user);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
			
// 			//Отправляю только текущему пользователю список всех в комнате
// 			socket.emit('ROOM:USERS_INFO', {
// 				room: user.roomId,
// 				users: getUsersInRoom(user.roomId)
// 			});
		
// 			callback();
// 		});

// 		socket.on('ROOM:LEAVE', (userId) => {
// 			roomLeaveHelper(socket, io, 'leave');
// 		})

// 		socket.on('disconnect', () => {
// 			roomLeaveHelper(socket, io);
// 		});


// 	})

// 	return io;
// }












