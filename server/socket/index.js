const officeRooms = {
  // [roomKey]: {
  // users: [],
  // randomTasks: [],
  // scores: [],
  // gameScore: 0,
  // employees: {},
  // numPlayers: 0
  // }
};

const connectedSockets = [];

module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    connectedSockets.push(socket.id);
    socket.broadcast.emit('someoneJoined', socket.id);

    socket.on('joinRoom', roomKey => {
      socket.join(roomKey);
      const roomInfo = officeRooms[roomKey];
      console.log('roomInfo', roomInfo);
      roomInfo.employees[socket.id] = {
        rotation: 0,
        x: 400,
        y: 300,
        employeeId: socket.id,
      };

      roomInfo.numEmployees = Object.keys(roomInfo.employees).length;

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

    socket.on('isKeyValid', function (input) {
      Object.keys(officeRooms).includes(input)
        ? socket.emit('keyIsValid', input)
        : socket.emit('keyNotValid');
    });
    // get a random code for the room
    socket.on('getRoomCode', async function () {
      let key = codeGenerator();
      Object.keys(officeRooms).includes(key) ? (key = codeGenerator()) : key;
      officeRooms[key] = {
        roomKey: key,
        employees: {},
        numEmployees: 0,
      };
      socket.emit('roomCreated', key);
    });

    function codeGenerator() {
      let code = '';
      let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
  });
};

// const officeRooms = {
//   // note - this is just reminding us that this will be added here eventually from another part of our code
//   // [roomKey]: {
//   // users: [],
//   // randomTasks: [],
//   // scores: [],
//   // gameScore: 0,
//   // players: {},
//   // numPlayers: 0
//   // }
// };

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log(
//       `A socket connection to the server has been made: ${socket.id}`
//     );
//     //below is the listener for the LOBBY click handler
//     //socket.on is syntax to listen - if keyIsValid exists then we send the input --- if not we return a new socket.emit called keyNOTVALID
//     socket.on("isKeyValid", function (input) {
//       const keyArray = Object.keys(officeRooms)
//         ? socket.emit("keyIsValid", input)
//         : socket.emit("keyNotValid");
//     });

//     //this allows us to get a random code for the room
//     //which is able to check if a room already exists
//     //note-kelsey - this is IMPORTANT because here we can store our "players" aka avatars/coworkers and figure out which room has what people and what functionallity
//     //i think we can eventually use this system to allow video stream to be always on or have different options!
//     socket.on("getRoomCode", async function () {
//       let key = codeGenerator();
//       Object.keys(officeRooms).includes(key) ? (key = codeGenerator()) : key;
//       officeRooms[key] = {
//         roomKey: key,
//         randomTasks: [],
//         gameScore: 0,
//         scores: {},
//         players: {},
//         numPlayers: 0,
//       };
//       socket.emit("roomCreated", key);
//     });
//   });
// };

// function codeGenerator() {
//   let code = "";
//   let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
//   for (let i = 0; i < 5; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// }
