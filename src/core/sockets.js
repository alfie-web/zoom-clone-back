
module.exports = (httpServer) => {
	const io = require('socket.io')(httpServer);
let socketList = {};


// Socket
io.on('connection', (socket) => {
	console.log(`New User connected: ${socket.id}`);
      
	socket.on('disconnect', () => {
	  socket.disconnect();
	  console.log('User disconnected!');
	});
      
	socket.on('BE-check-user', ({ roomId, userName }) => {
	  let error = false;
      
	  io.sockets.in(roomId).clients((err, clients) => {
	    clients.forEach((client) => {
	      if (socketList[client] == userName) {
		error = true;
	      }
	    });
	    socket.emit('FE-error-user-exist', { error });
	  });
	});
      
	/**
	 * Join Room
	 */
	socket.on('BE-join-room', ({ roomId, userName }) => {
	  // Socket Join RoomName
	  socket.join(roomId);
	  socketList[socket.id] = { userName, video: true, audio: true };
      
	  // Set User List
	  io.sockets.in(roomId).clients((err, clients) => {
	    try {
	      const users = [];
	      clients.forEach((client) => {
		// Add User List
		users.push({ userId: client, info: socketList[client] });
	      });
	      socket.broadcast.to(roomId).emit('FE-user-join', users);
	      // io.sockets.in(roomId).emit('FE-user-join', users);
	    } catch (e) {
	      io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
	    }
	  });
	});
      
	socket.on('BE-call-user', ({ userToCall, from, signal }) => {
	  io.to(userToCall).emit('FE-receive-call', {
	    signal,
	    from,
	    info: socketList[socket.id],
	  });
	});
      
	socket.on('BE-accept-call', ({ signal, to }) => {
	  io.to(to).emit('FE-call-accepted', {
	    signal,
	    answerId: socket.id,
	  });
	});
      
	socket.on('BE-send-message', ({ roomId, msg, sender }) => {
	  io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
	});
      
	socket.on('BE-leave-room', ({ roomId, leaver }) => {
	  delete socketList[socket.id];
	  socket.broadcast
	    .to(roomId)
	    .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
	  io.sockets.sockets[socket.id].leave(roomId);
	});
      
	socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
	  if (switchTarget === 'video') {
	    socketList[socket.id].video = !socketList[socket.id].video;
	  } else {
	    socketList[socket.id].audio = !socketList[socket.id].audio;
	  }
	  socket.broadcast
	    .to(roomId)
	    .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
	});
      });

      
}



























// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	const users = {};
// 	const socketToRoom = {};

// 	io.on('connection', socket => {
// 		socket.on("join room", roomId => {
// 			if (users[roomId]) {
// 				const length = users[roomId].length;
// 				if (length === 4) {
// 					socket.emit("room full");
// 					return;
// 				}
// 				users[roomId].push(socket.id);
// 			} else {
// 				users[roomId] = [socket.id];
// 			}
// 			socketToRoom[socket.id] = roomId;
// 			const usersInThisRoom = users[roomId].filter(id => id !== socket.id);

// 			socket.emit("all users", usersInThisRoom);
// 		});

// 		socket.on("sending signal", payload => {
// 			io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
// 		});

// 		socket.on("returning signal", payload => {
// 			io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
// 		});

// 		socket.on('disconnect', () => {
// 			const roomId = socketToRoom[socket.id];
// 			let room = users[roomId];
// 			if (room) {
// 				room = room.filter(id => id !== socket.id);
// 				users[roomId] = room;
// 			}
// 		});

// 	});

// }


























// const { addUser, getUsersInRoom, removeUser, removeUserById } = require('./usersSocket');

// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	io.on('connection', socket => {
// 		socket.on('join-room', (roomId, peerId, userId) => {
// 			console.log('join-room', {roomId, peerId, userId})

// 			// const { error, user } = addUser({ socketId: socket.id, roomId, peerId, userId });

// 			// if (error) {
// 			//     return
// 			// }

// 			socket.join(roomId)
// 			socket.to(roomId).broadcast.emit('user-connected', { peerId, userId });
// 			// io.to(roomId).emit('user-connected', { peerId, userId });

// 			// const usersWithoutCurrent = getUsersInRoom(roomId).filter(u => u.userId !== userId)

// 			// io.to(roomId).emit('all-connected', usersWithoutCurrent);
// 			// io.to(roomId).emit('all-connected', getUsersInRoom(roomId));

	
// 			socket.on('disconnect', () => {
// 				socket.to(roomId).broadcast.emit('user-disconnected', peerId)
// 			})
// 		})
// 	})

// 	return io;
// }














// Текущая рабочая версия

// module.exports = (httpServer) => {
// 	const io = require('socket.io')(httpServer);

// 	io.on('connection', socket => {
// 		socket.on('join-room', (roomId, userId) => {
// 			console.log('join-room', {roomId, userId})
// 			socket.join(roomId)
// 			socket.to(roomId).broadcast.emit('user-connected', userId);
// 			// messages
// 			socket.on('message', (message) => {
// 				//send message to the same room
// 				io.to(roomId).emit('createMessage', message)
// 			});
	
// 			socket.on('disconnect', () => {
// 				socket.to(roomId).broadcast.emit('user-disconnected', userId)
// 			})
// 		})
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












