const { addUser, getUsersInRoom, removeUser, removeUserById } = require('./usersSocket');


const roomLeaveHelper = (socket, io, leave) => {
	const user = removeUser(socket.id);

	if (user) {
		socket.leave(user.id);

		console.log(`${user.fullname} has left!`)
		// io.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has left!`);

			// io.to(user.room).emit('ROOM:USERS_INFO', {
			socket.broadcast.to(user.room).emit('ROOM:USERS_INFO', {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
	}
}


module.exports = (httpServer) => {
	const io = require('socket.io')(httpServer);

	io.on('connection', socket => {
		console.log('New socket connection');

		socket.on('ROOM:JOIN', ({ room, fullname, userId }, callback) => {
			// if (!room) return;
			const { error, user } = addUser({ id: socket.id, room, fullname, userId });

		
			if (error) {
			    return callback(error);
			}
		
			socket.join(user.room); 
		
			socket.emit('ROOM:INFO_MESSAGE', 'Welcome!'); 
			socket.broadcast.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has joined!`);	// Отправит всем пользователям в комнате, кроме самого пользователя, чтобы отправить только себе и только в комнате нужно убрать broadcast (но это не точно)
			
			//Когда присоединился новый пользователь, отправляем список всех пользователей всем в комнате
			console.log('ROOM:USERS_INFO')
			io.to(user.room).emit('ROOM:USERS_INFO', {

			// socket.emit('ROOM:USERS_INFO', {
			// socket.to(user.room).emit('ROOM:USERS_INFO', {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
		
			callback();
		});

		socket.on('ROOM:LEAVE', (userId) => {
			roomLeaveHelper(socket, io, 'leave');

			// const user = removeUserById(userId);

			// if (user) {
			// 	socket.leave(user.id);

			// 	console.log(`${user.fullname} has left!`)
			// 	// io.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has left!`);

			// 	//Когда пользователь покинул комнату, отправляем список всех пользователей текущему
			// 	// io.to(user.room).emit('ROOM:USERS_INFO', {

			// 	socket.broadcast.to(user.room).emit('ROOM:USERS_INFO', {
			// 		room: user.room,
			// 		users: getUsersInRoom(user.room)
			// 	});
			// }
		})

		socket.on('disconnect', () => {
			roomLeaveHelper(socket, io);

			// const user = removeUser(socket.id);

			// if (user) {
			// 	// socket.leave(user.id);

			// 	console.log(`${user.fullname} has left!`)
			// 	io.to(user.room).emit('ROOM:INFO_MESSAGE', `${user.fullname} has left!`);

			// 	//Когда пользователь покинул комнату, отправляем список всех пользователей текущему
			// 	io.to(user.room).emit('ROOM:USERS_INFO', {
			// 		room: user.room,
			// 		users: getUsersInRoom(user.room)
			// 	});
			// }
		});


	})

	return io;
}