const uuid = require('uuid')

const rooms = {}
const messages = {}
const userInRoom = {}

function getRooms() {
  return Object.values(rooms)
}
function getMessages(roomId) {
  return messages[roomId]
}

function getRoom(roomId) {
  return rooms[roomId]
}

function createRoom(creator, name) {
  const id = uuid.v4()
  rooms[id] = {
    id,
    name,
    creator,
    users: {},
    active: {},
  }
  messages[id] = []
  return rooms[id]
}
function sendMessage(roomId, sender, text) {
  const message = {
    sender,
    text,
    date: Date.now(),
    first: false,
  }
  console.log('new message', message)
  console.log('current active', rooms[roomId].active)

  if (rooms[roomId].active[sender] === undefined) {
    console.log('changing user', sender)
    rooms[roomId].active[sender] = Object.values(rooms[roomId].active).length
    message.first = true
  }

  messages[roomId].push(message)

  return message
}

function joinRoom(roomId, id, user) {
  userInRoom[id] = roomId
  rooms[roomId].users[id] = user
  return rooms[roomId]
}

function leaveRoom(id) {
  const roomId = userInRoom[id]
  if (!roomId) return console.log('NO SUCH ROOM')
  delete userInRoom[id]
  delete rooms[roomId].users[id]
  return rooms[roomId]
}

function deleteRoom(roomId, requester) {
  const room = rooms[roomId]
  if (room.creator !== requester) throw new Error('No rights to delete this room')

  delete rooms[roomId]
  delete messages[roomId]
}

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  getMessages,
  sendMessage,
}
