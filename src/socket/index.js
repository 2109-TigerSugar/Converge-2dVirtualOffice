export const socket = io();

socket.on('connect', () => {
  console.log('socket connection ', socket.id)
})
