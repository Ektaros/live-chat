import 'bootstrap/dist/css/bootstrap.min.css'

import { InputGroup, Button, FormControl, ListGroup, Badge } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import io from 'socket.io-client'
import axios from 'axios'
import { CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM, ROOM_CHANGED, ROOM_CREATED } from './events'
import { host } from './constants'
import Chat from './Chat'

const socket = io.connect('ws://localhost:1234', {
  transports: ['websocket']
})
function App() {
  const [name, setName] = useState('god sop')
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('roome')

  const [currentRoom, setCurrentRoom] = useState(null)

  const saveName = newName => {
    setName(newName)
  }

  const createRoom = () => socket.emit(CREATE_ROOM, { roomName, creator: name })

  const joinRoom = room => {
    socket.emit(JOIN_ROOM, { roomId: room.id, user: name })
    setCurrentRoom(room)
  }

  const leaveRoom = roomId => {
    socket.emit(LEAVE_ROOM, { roomId, user: name })
    setCurrentRoom(null)
  }

  useEffect(() => {
    axios(host + '/rooms').then(({ data }) => setRooms(data))

    socket.on(ROOM_CREATED, room => setRooms(rooms => [...rooms, room]))
    socket.on(ROOM_CHANGED, newRoom => {
      setCurrentRoom(currentRoom => (currentRoom?.id === newRoom.id ? newRoom : currentRoom))
      setRooms(rooms => rooms.map(room => (room.id === newRoom.id ? newRoom : room)))
    })
  }, [])

  return (
    <div>
      <br />
      {currentRoom ? (
        <Chat userName={name} room={currentRoom} socket={socket} leaveRoom={leaveRoom}></Chat>
      ) : (
        <div style={{ width: '40rem' }}>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Your name:</InputGroup.Text>
            <FormControl value={name} onChange={e => saveName(e.target.value)} aria-describedby='basic-addon1' />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Room name:</InputGroup.Text>
            <FormControl value={roomName} onChange={e => setRoomName(e.target.value)} aria-describedby='basic-addon1' />
            <Button onClick={createRoom} disabled={name.length < 1} id='button-room'>
              Create room
            </Button>
          </InputGroup>
          <br />
          <ListGroup>
            {rooms.map(room => {
              return (
                <ListGroup.Item
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                  key={room.id}
                  onClick={() => joinRoom(room)}
                >
                  <div className='ms-2 me-auto'>{room.name}</div>
                  <Badge pill>by {room.creator}</Badge>
                  <Badge bg='secondary' pill>
                    {Object.keys(room.users).length} users
                  </Badge>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div>
      )}
    </div>
  )
}

export default App
