const { NEW_MESSAGE, ROOM_CHANGED } = require('../../src/events')
const { sendMessage, getRoom } = require('../roomsStore')

function sendMessageHandler({ io }, { roomId, sender, text }) {
  const message = sendMessage(roomId, sender, text)

  if (message.first) {
    io.emit(ROOM_CHANGED, getRoom(roomId))
  }
  io.in(roomId).emit(NEW_MESSAGE, message)
}

module.exports = {
  sendMessageHandler,
}
