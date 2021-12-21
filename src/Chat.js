import axios from 'axios'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { host } from './constants'
import { InputGroup, Button, FormControl, ListGroup, Badge } from 'react-bootstrap'
import { NEW_MESSAGE, SEND_MESSAGE } from './events'

const bgs = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
const bgsDarkText = ['warning', 'light']

function Chat({ userName, room, socket, leaveRoom }) {
  const messagesList = useRef()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const scrollToBottom = () => {
    messagesList.current.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  const sendMessage = () => {
    socket.emit(SEND_MESSAGE, {
      text,
      roomId: room.id,
      sender: userName,
    })
    setText('')
  }

  const handleKeypress = e => {
    //it triggers by pressing the enter key
    if (e.which === 13) {
      sendMessage()
    }
  }

  useEffect(() => {
    axios.get(host + '/messages', { params: { roomId: room.id } }).then(({ data }) => setMessages(data))
    socket.on(NEW_MESSAGE, message => setMessages(messages => [...messages, message]))
    return () => socket.removeAllListeners(NEW_MESSAGE)
  }, [])
  useEffect(() => {}, [room])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div>
      <div style={{ float: 'right', position: 'absolute', marginLeft: '41rem', marginTop: '3rem' }}>
        <h4>Users in room</h4>
        <ListGroup>
          {Object.values(room.users).map(user => {
            return (
              <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start' key={user}>
                <div className='ms-2 me-auto'>{user}</div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </div>
      <div style={{ width: '40rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Room: {room.name}</h2>
          </div>
          <Button variant="danger" onClick={() => leaveRoom(room.id, userName)}>Leave room</Button>
        </div>
        <div
          style={{
            height: '35rem',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            overflow: 'auto',
            overflowAnchor: 'auto',
          }}
        >
          <ListGroup variant='flush'>
            {messages.map((message, index) => {
              const bg = bgs[room.active[message.sender] % bgs.length]
              console.log(room.active[message.sender])
              return (
                <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start' key={index}>
                  <Badge text={bgsDarkText.includes(bg) ? 'dark' : 'light'} bg={bg}>
                    {message.sender}
                  </Badge>

                  <div className='ms-2 me-auto'>{message.text}</div>
                  <Badge bg='secondary'>{moment(message.date).format('h:mm:ss')}</Badge>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          <div ref={messagesList}></div>
        </div>
        <InputGroup className='mb-3'>
          <FormControl
            placeholder='Enter your message here...'
            value={text}
            onChange={e => setText(e.target.value)}
            aria-describedby='basic-addon1'
            onKeyPress={handleKeypress}
          />
          <Button onClick={sendMessage} disabled={text < 1} id='button-room'>
            Send
          </Button>
        </InputGroup>
      </div>
    </div>
  )
}

export default Chat
