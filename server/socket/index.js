const officeRooms = {
  test: {
    roomKey: 'test',
    numEmployees: 0,
    employees: {},
  },
};

const connectedSockets = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    console.log('on connection office rooms', officeRooms);
    connectedSockets.push(socket.id);
    // socket.broadcast.emit('someoneJoined', socket.id);

    socket.on('joinRoom', (userData) => {
      const { name, roomKey, avatar, officeType } = userData
      if (socket.rooms.has(roomKey) || !officeRooms[roomKey]) {
        return;
      }
      socket.join(roomKey);
      const roomInfo = officeRooms[roomKey];
      roomInfo.employees[socket.id] = {
        rotation: 0,
        x: 3400,
        y: 3600,
        employeeId: socket.id,
        avatar,
        name,
        roomKey
      };

      roomInfo.numEmployees = Object.keys(roomInfo.employees).length;
      console.log('roomInfo in joinRoom', roomInfo);

      // why only emit it to a single socket?
      //set initial state HERE
      socket.emit('setState', roomInfo);

      //sending the employees object to the new employee
      socket.emit('currentEmployees', {
        employees: roomInfo.employees,
        numEmployees: roomInfo.numEmployees,
      });

      //HERE UPDATE ALL COWORKERS OF THE NEW EMPLOYEE
      socket.to(roomKey).emit('newEmployee', {
        employeeInfo: roomInfo.employees[socket.id],
        numEmployees: roomInfo.numEmployees,
      });
    });

    // HERE UPDATE THE EMPLOYEES MOVEMENT DATA
    socket.on('employeeMovement', function (data) {
      const { x, y, roomKey } = data;
      officeRooms[roomKey].employees[socket.id].x = x;
      officeRooms[roomKey].employees[socket.id].y = y;

      //emit a message to all employees about the movement of coworker
      socket
        .to(roomKey)
        .emit('employeeMoved', officeRooms[roomKey].employees[socket.id]);
    });

    // user leaves room (socket not disconnected)
    socket.on('leaveRoom', (roomKey) => {
      socket.leave(roomKey);
      if (!officeRooms[roomKey]) return;
      delete officeRooms[roomKey].employees[socket.id];
          officeRooms[roomKey].numEmployees = Object.keys(
            officeRooms[roomKey].employees
          ).length;
      socket.emit('leftRoom');

      io.to(roomKey).emit('coworker disconnected', {
        coworkerId: socket.id,
        numEmployees: officeRooms[roomKey].numEmployees,
      });

    })

    // disconnecting: right before disconnect
    socket.on('disconnecting', () => {
      // can access the rooms socket belonged to
      console.log('user disconnecting belonged to', socket.rooms);

      socket.rooms.forEach((roomKey) => {
        if (officeRooms[roomKey]) {
          // remove that employee from the employee list
          // decrease the numEmployee of that room
          delete officeRooms[roomKey].employees[socket.id];
          officeRooms[roomKey].numEmployees = Object.keys(
            officeRooms[roomKey].employees
          ).length;
          console.log('room after user disconnects', officeRooms[roomKey]);

          // need to notify coworkers that socket.id has disconnected
          io.to(roomKey).emit('coworker disconnected', {
            coworkerId: socket.id,
            numEmployees: officeRooms[roomKey].numEmployees,
          });
        }
      });
    });


    socket.on('isKeyUnique', function (roomKey) {
      // if key is unique
      if (officeRooms[roomKey] === undefined) {
        officeRooms[roomKey] = {
          //create room
          roomKey,
          employees: {},
          numEmployees: 0,
        };
        console.log(officeRooms);
        socket.emit('roomUniqueCheck', true);
      } else {
        socket.emit('roomUniqueCheck', false); //should not join room
      }
    });

    socket.on('doesKeyExist', function (roomKey) {
      socket.emit('roomExistCheck', officeRooms[roomKey] !== undefined);
    });
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
  io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });

};
