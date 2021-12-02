const officeRooms = {};
// {office-1: {numEmployee: 4 , employees: [{socketid:  {rotation, x, y}}}

const connectedSockets = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    console.log('on connection office rooms', officeRooms);
    connectedSockets.push(socket.id);
    socket.broadcast.emit('someoneJoined', socket.id);

    socket.on('joinRoom', (roomKey) => {
      if (socket.rooms.has(roomKey) || !officeRooms[roomKey]) return;
      socket.join(roomKey);
      const roomInfo = officeRooms[roomKey];
      console.log('roominfo', roomInfo)
      roomInfo.employees[socket.id] = {
        rotation: 0,
        x: 400,
        y: 300,
        employeeId: socket.id,
      };

      roomInfo.numEmployees = Object.keys(roomInfo.employees).length;
      console.log('roomInfo in joinRoom', roomInfo);

      // why only emit it to a single socket?
      //set initial state HERE
      console.log('setState called');
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

    // disconnecting: right before disconnect
    socket.on('disconnecting', () => {
      // can access the rooms socket belonged to
      console.log('user disconnecting belonged to', socket.rooms);

      socket.rooms.forEach((roomKey) => {
        if (officeRooms[roomKey]) {
          // remove that employee from the employee list
          // decrease the numEmployee of that room
          delete officeRooms[roomKey].employees[socket.id];
          officeRooms[roomKey].numEmployees = Object.keys(officeRooms[roomKey].employees).length;
          console.log('room after user disconnects', officeRooms[roomKey]);

          // need to notify coworkers that socket.id has disconnected
          socket.to(roomKey).emit('coworker disconnected', {coworkerId: socket.id, numEmployees: officeRooms[roomKey].numEmployees });
        }
      });
    });

    //disconnect
    socket.on('disconnect', () => {
      //used for peerjs to remove video element
      io.emit('socket disconnected', socket.id);
    });
    // socket.on("disconnect", function () {
    //   let roomKey = 0;
    //   for (let keys1 in officeRooms) {
    //     for (let keys2 in officeRooms[keys1]) {
    //       Object.keys(officeRooms[keys1][keys2]).map((el) => {
    //         if (el === socket.id) {
    //           roomKey = keys1;
    //         }
    //       });
    //     }
    //   }

    //   const roomInfo = officeRooms[roomKey];

    //   if (roomInfo) {
    //     console.log("user disconnected: ", socket.id);
    //     //removing from employee object
    //     delete roomInfo.employees[socket.id];
    //     //update count
    //     roomInfo.numEmployees = Object.keys(roomInfo.employees).length;
    //     io.to(roomKey).emit("disconnected", {
    //       employeeId: socket.id,
    //       numEmployees: roomInfo.numEmployees,
    //     });
    //   }
    // });

    socket.on('isKeyUnique', function (roomKey) {
      // Object.keys(officeRooms).includes(input)
      //   ? socket.emit("keyIsUnique", input)
      //   : socket.emit("DuplicateKey");

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
      console.log('does room exist', officeRooms[roomKey]);
      socket.emit('roomExistCheck', officeRooms[roomKey] !== undefined);
    });

  });
};
