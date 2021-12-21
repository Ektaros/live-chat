const { CREATE_ROOM, LEAVE_ROOM, JOIN_ROOM, SEND_MESSAGE } = require('../../src/events')
const { sendMessageHandler } = require('./messages')
const { createRoomHandler, leaveRoomHandler, joinRoomHandler } = require('./rooms')

module.exports = {
  [CREATE_ROOM]: createRoomHandler,
  [LEAVE_ROOM]: leaveRoomHandler,
  [JOIN_ROOM]: joinRoomHandler,
  [SEND_MESSAGE]: sendMessageHandler,
  disconnect: leaveRoomHandler
}
