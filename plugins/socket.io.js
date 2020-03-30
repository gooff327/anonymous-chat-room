import io from 'socket.io-client'

const socket = io("http://www.gooff.tech/ws", { transports: ['websocket', 'polling'] })

export default socket
