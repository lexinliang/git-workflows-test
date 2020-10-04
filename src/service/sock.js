import io from 'socket.io-client'

const socketConfigCommon = {
  timeout: 3000,
  transports: ['websocket'],
  reconnectionAttempts: 5,
}

const diceUrl = 'ws://10.125.55.174:19888'

const diceSocket = io(diceUrl, {
  autoConnect: false,
  ...socketConfigCommon,
})

diceSocket.on('connect', () => {
  console.log('diceSocket connected: ', diceSocket.connected) // true
})

diceSocket.on('disconnect', () => {
  console.log('diceSocket disconnected: ', diceSocket.connected) // false
})

export { diceSocket }


