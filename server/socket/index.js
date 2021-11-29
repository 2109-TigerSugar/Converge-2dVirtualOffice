const officeRooms = {};

const connectedSockets = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    connectedSockets.push(socket.id);
    socket.broadcast.emit("someoneJoined", socket.id);

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);
      const roomInfo = officeRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.employees[socket.id] = {
        rotation: 0,
        x: 400,
        y: 300,
        employeeId: socket.id,
      };

      roomInfo.numEmployees = Object.keys(roomInfo.employees).length;

      //set initial state HERE
      socket.emit("setState", roomInfo);

      //sending the employees object to the new employee
      socket.emit("currentEmployees", {
        employees: roomInfo.employees,
        numEmployees: roomInfo.numEmployees,
      });

      //HERE UPDATE ALL COWORKERS OF THE NEW EMPLOYEE
      socket.to(roomKey).emit("newEmployee", {
        employeeInfo: roomInfo.employees[socket.id],
        numEmployees: roomInfo.numEmployees,
      });
    });

    // HERE UPDATE THE EMPLOYEES MOVEMENT DATA
    socket.on("employeeMovement", function (data) {
      const { x, y, roomKey } = data;
      officeRooms[roomKey].employees[socket.id].x = x;
      officeRooms[roomKey].employees[socket.id].y = y;

      //emit a message to all employees about the movement of coworker
      socket
        .to(roomKey)
        .emit("employeeMoved", officeRooms[roomKey].employees[socket.id]);
    });

    //disconnecting
    socket.on('disconnect', () => {
      io.emit("socket disconnected", socket.id)
    })
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

    socket.on("isKeyValid", function (input) {
      Object.keys(officeRooms).includes(input)
        ? socket.emit("keyIsValid", input)
        : socket.emit("keyNotValid");
    });
    // get a random code for the room
    socket.on("getRoomCode", async function () {
      let key = "key";
      Object.keys(officeRooms).includes(key) ? (key = "key") : key;
      officeRooms[key] = {
        roomKey: key,
        employees: {},
        numEmployees: 0,
      };
      socket.emit("roomCreated", key);
    });

    socket.on('peer closed', function(data) {
      console.log(data);
      // socket.broadcast.emit(data)
    })
  });
};
