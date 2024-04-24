'use client'

import React, { useEffect, useRef } from 'react'
import { useCanvas } from '../model/canvasStore'
import { useTool } from '../model/toolStore'
import { Brush } from '../model/tools/Brush'
import { Rect } from '../model/tools/Rect'
import axios from 'axios'
import { saveImage } from '../lib/helpers/saveCanvas'

type CanvasProps = {
  roomId: string
  username: string
}

export const Canvas = ({ roomId, username }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { setCanvas, setWebSocket, pushToUndo } = useCanvas((state) => state)
  const setTool = useTool((state) => state.setTool)

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current)

      let ctx = canvasRef.current.getContext('2d')

      axios
        .get(`${process.env.NEXT_PUBLIC_PAINT_DOMAIN}/image?id=${roomId}`)
        .then((response) => {
          const img = new Image()
          img.src = response.data
          img.onload = () => {
            if (!canvasRef.current) return

            ctx?.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            )
            ctx?.drawImage(
              img,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            )
          }
        })
        .catch((error) => console.log(error))
    }
  }, [])

  const drawHandler = (msg: any) => {
    const figure = msg.figure

    const ctx = canvasRef.current?.getContext('2d')

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
    if (canvasRef.current) {
      const socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_PAINT_URL}`,
      )
      setCanvas(canvasRef.current)
      setWebSocket(socket)
      setTool(new Brush(canvasRef.current, socket, roomId))

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
  }, [])

  const mouseDownHandler = () => {
    if (canvasRef.current) {
      const img = canvasRef.current.toDataURL()

      pushToUndo(img)
      saveImage(img, roomId)
    }
  }

  const mouseUpHandler = () => {
    if (canvasRef.current) {
      saveImage(canvasRef.current.toDataURL(), roomId)
    }
  }

  return (
    <div className="h-full flex justify-center items-center ">
      <canvas
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={canvasRef}
        width={600}
        height={400}
        className="bg-white rounded-md border-2"
      />
    </div>
  )
}
