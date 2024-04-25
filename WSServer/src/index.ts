import express from 'express'
import expressWs from 'express-ws'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { WebSocket } from 'ws'

const app = express()
const WSServer = expressWs(app)
const server = WSServer.app
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000

server.use(cors())
server.use(express.json())

type WSMessage = {
  method: 'connection' | 'draw',
  id: string
}


server.ws('/paint', (ws, req) => {
  ws.on('message', (msg: string) => {
    const message = JSON.parse(msg) as WSMessage

    switch (message.method) {
      case "connection":
        connectionHandler(ws, message)
        break
      case "draw":
        broadcastConnection(ws, message)
        break
    }
  })
})

server.post('/paint/image', (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '')

    fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')

    return res.status(200).json({ message: "Загружено" })
  } catch (e) {
    console.log(e)
    return res.status(500).json('error')
  }
})
server.get('/paint/image', (req, res) => {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
    const data = `data:image/png;base64,` + file.toString('base64')
    res.json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json('error')
  }
})

server.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws: WebSocket, msg: WSMessage) => {
  ws.id = msg.id
  broadcastConnection(ws, msg)
}

const broadcastConnection = (ws: WebSocket, msg: WSMessage) => {
  aWss.clients.forEach((client: WebSocket) => {
    const sending = (client: WebSocket) => {
      if (client.id === msg.id) {
        client.send(JSON.stringify(msg))
      }
    }

    sending(client)
  })
}