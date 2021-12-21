const { Server } = require('socket.io')

module.exports = (httpServer, events) => {
  const io = new Server()
  io.attach(httpServer)

  io.on('connection', socket => {
    const context = { io, socket }

    console.log('a user connected', socket.id)
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id)
      socket.disconnect(true)
    })

    Object.entries(events).forEach(([name, handler]) => socket.on(name, data => handler(context, data)))
  })
  return httpServer
}
