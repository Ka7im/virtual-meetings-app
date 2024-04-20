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

    io.engine.on("connection_error", (err) => {
      console.log('SOCKET.IO', err.code);     // 3
      console.log('SOCKET.IO', err.message);  // "Bad request"
      console.log('SOCKET.IO', err.context);  // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
    });

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
