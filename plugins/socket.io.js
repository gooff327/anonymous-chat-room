import io from 'socket.io-client'

const socket = io(process.env.WS_URL, { transports: ['websocket', 'polling'] })

export default socket
