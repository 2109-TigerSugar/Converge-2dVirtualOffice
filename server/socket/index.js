const officeRooms = {};
// {office-1: {numEmployee: 4 , employees: [{socketid:  {rotation, x, y}}}

const connectedSockets = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    connectedSockets.push(socket.id);
    socket.broadcast.emit('someoneJoined', socket.id);

    socket.on('joinRoom', (roomKey) => {
      if (Array.from(socket.rooms).includes(roomKey)) return;
      socket.join(roomKey);
      console.log(Array.from(socket.rooms));
      const roomInfo = officeRooms[roomKey];
      roomInfo.employees[socket.id] = {
        rotation: 0,
        x: 400,
        y: 300,
        employeeId: socket.id,
      };

      roomInfo.numEmployees = Object.keys(roomInfo.employees).length;
      console.log('roomInfo in joinRoom', roomInfo);

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

    // disconnecting: right before disconnect
    socket.on('disconnecting', () => {
      // can access the rooms socket belonged to
      console.log(socket.id);
      console.log('disconnecting', socket.rooms);

      let rooms = Array.from(socket.rooms);
      rooms.forEach((key) => {
        if (officeRooms[key]) {
          delete officeRooms[key].employees[socket.id];
          if (officeRooms[key].numEmployees <= 1)
            officeRooms[key].numEmployees = 0;
          console.log(officeRooms[key]);
        }
      });
    });

    //disconnect
    socket.on('disconnect', () => {
      io.emit('socket disconnected', socket.id); //used for peerjs to remove video element

      // remove that employee from the employee list
      // decrease the numEmployee of that room
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
        socket.emit('unique-key');
      } else {
        socket.emit('duplicate-key'); //error
      }
    });
    // get a random code for the room
    // socket.on("getRoomCode", async function () {
    //   let key = "key";
    //   Object.keys(officeRooms).includes(key) ? (key = "key") : key;
    //   officeRooms[key] = {
    //     roomKey: key,
    //     employees: {},
    //     numEmployees: 0,
    //   };
    //   socket.emit("roomCreated", key);
    // });
  });
};
