
import { NextApiResponseServerIO } from '@/shared/types/io'

import { Server as NetServer } from 'net'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any

    //@ts-ignore
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })


    io.on('connection', async (socket) => {
      socket.on('initialize-paint-room', async (msg) => {

        const payload = msg
        console.log(payload, 'payload')


        socket.join(`roomId:${payload.roomId}`)
        console.log('socket rooms', socket.rooms)


        socket.to(`roomId:${payload.roomId}`).emit('connection-paint-room', `CONNECTED ${payload.username}`)
      })

      socket.on('draw', (msg) => {
        console.log('msg input-paint', msg)

        socket.to(`roomId:${msg.roomId}`).emit('draw', msg)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
