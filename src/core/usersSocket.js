const users = [];

//addUser, removeUser, getUser, getUserInRoom

const addUser = ({ socketId, fullname, roomId, userId, signal }) => {
	//Clean the data
	fullname = fullname.trim().toLowerCase();
	roomId = roomId.trim().toLowerCase();

	//Validate the data
	if (!fullname || !roomId || !userId) {
		return {
			error: 'Fullname and room are required!'
		}
	}

	//Check for existing user
	const existingUser = users.find((user) => {
		return user.roomId === roomId && user.userId === userId;
	});

	//Validate fullname
	if (existingUser) {
		return {
			error: 'Fullname is in use!'
		}
	}

	//Store user
	const user = { socketId, fullname, roomId, userId, signal };
	users.push(user);
	return { user };
};

const removeUser = (socketId) => {
	const index = users.findIndex((user) => user.socketId === socketId);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

const removeUserById = (userId) => {
	const index = users.findIndex((user) => user.userId === userId);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

const getUser = (socketId) => {
	return users.find((user) => user.socketId === socketId);

};

const getUsersInRoom = (roomId) => {
	return users.filter((user) => user.roomId === roomId.trim().toLowerCase());
};

module.exports = {
	addUser,
	removeUser,
	removeUserById,
	getUser,
	getUsersInRoom
};






























// const users = [];

// //addUser, removeUser, getUser, getUserInRoom

// const addUser = ({ id, fullname, room, userId }) => {
// 	//Clean the data
// 	fullname = fullname.trim().toLowerCase();
// 	room = room.trim().toLowerCase();

// 	//Validate the data
// 	if (!fullname || !room || !userId) {
// 		return {
// 			error: 'Fullname and room are required!'
// 		}
// 	}

// 	//Check for existing user
// 	const existingUser = users.find((user) => {
// 		return user.fullname === fullname && user.room === room && user.userId === userId;
// 	});

// 	//Validate fullname
// 	if (existingUser) {
// 		return {
// 			error: 'Fullname is in use!'
// 		}
// 	}

// 	//Store user
// 	const user = { id, fullname, room, userId };
// 	users.push(user);
// 	return { user };
// };

// const removeUser = (id) => {
// 	const index = users.findIndex((user) => user.id === id);

// 	if (index !== -1) {
// 		return users.splice(index, 1)[0];
// 	}
// }

// const removeUserById = (userId) => {
// 	const index = users.findIndex((user) => user.userId === userId);

// 	if (index !== -1) {
// 		return users.splice(index, 1)[0];
// 	}
// }

// const getUser = (id) => {
// 	return users.find((user) => user.id === id);

// };

// const getUsersInRoom = (room) => {
// 	return users.filter((user) => user.room === room.trim().toLowerCase());
// };

// module.exports = {
// 	addUser,
// 	removeUser,
// 	removeUserById,
// 	getUser,
// 	getUsersInRoom
// };