
import { useCanvas } from "@/widgets/paint/model/canvasStore"
import { useTool } from "@/widgets/paint/model/toolStore"
import { Brush } from "@/widgets/paint/model/tools/Brush"
import { Rect } from "@/widgets/paint/model/tools/Rect"

import { useEffect } from "react"

type UsePaintSocketProps = {
  roomId: string
  username: string
  canvas: HTMLCanvasElement | null
}

export const usePaintSocket = ({ roomId, username, canvas }: UsePaintSocketProps) => {
  const { setCanvas, setWebSocket } = useCanvas((state) => state)
  const setTool = useTool((state) => state.setTool)

  console.log(canvas)

  const drawHandler = (msg: any) => {
    const figure = msg.figure

    const ctx = canvas?.getContext('2d')

    if (!ctx) return

    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y)
        break
      case 'rect':
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color,
        )
        break
      case 'finish':
        ctx.beginPath()
        break
    }
  }

  useEffect(() => {
    if (canvas) {
      const socket = new WebSocket('ws://localhost:5000/')
      setCanvas(canvas)
      setWebSocket(socket)
      setTool(new Brush(canvas, socket, roomId))

      socket.onopen = () => {
        console.log('Подключение установлено')
        socket.send(
          JSON.stringify({
            id: roomId,
            username,
            method: 'connection',
          }),
        )
      }

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)

        switch (msg.method) {
          case 'connection':
            console.log(`пользователь ${msg.username} присоединился`)
            break
          case 'draw':
            drawHandler(msg)
            break
        }
      }
    }
  }, [canvas])
}