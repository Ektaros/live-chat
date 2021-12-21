const { ROOM_CREATED, ROOM_CHANGED } = require('../../src/events')
const { createRoom, joinRoom, leaveRoom } = require('../roomsStore')

function createRoomHandler({ io }, { creator, roomName }) {
  const room = createRoom(creator, roomName)
  io.emit(ROOM_CREATED, room)
}

function joinRoomHandler({ io, socket }, { roomId, user }) {
  socket.join(roomId)
  const room = joinRoom(roomId, socket.id, user)
  io.emit(ROOM_CHANGED, room)
}

function leaveRoomHandler({ io, socket }, { roomId }) {
  socket.leave(roomId)
  const room = leaveRoom(socket.id)
  io.emit(ROOM_CHANGED, room)
}

module.exports = {
  joinRoomHandler,
  leaveRoomHandler,
  createRoomHandler,
}
