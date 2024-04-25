'use client'

import {
  Brush as BrushIcon,
  Circle as CircleIcon,
  Eraser as EraserIcon,
  Minus,
  Redo2,
  Save,
  Square,
  Undo2,
} from 'lucide-react'
import { useTool } from '../model/toolStore'
import { useCanvas } from '../model/canvasStore'
import { Brush } from '../model/tools/Brush'
import { Rect } from '../model/tools/Rect'
import { Circle } from '../model/tools/Circle'
import Eraser from '../model/tools/Eraser'
import Line from '../model/tools/Line'
import { ChangeEvent } from 'react'

type ToolBarProps = {
  roomId: string
}

export const Toolbar = ({ roomId }: ToolBarProps) => {
  const { canvas, undo, redo, socket } = useCanvas((state) => state)

  const { setFillColor, setStrokeColor, setTool } = useTool((state) => state)

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value)
    setFillColor(e.target.value)
  }

  const download = () => {
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      console.log(dataUrl)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = roomId + '.jpg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="h-10 flex items-center bg-white shadow justify-between px-4 ">
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => {
            if (canvas && socket) {
              setTool(new Brush(canvas, socket, roomId))
            }
          }}
        >
          <BrushIcon color="black" />
        </button>
        <button
          onClick={() => {
            if (canvas && socket) {
              setTool(new Rect(canvas, socket, roomId))
            }
          }}
        >
          <Square color="black" />
        </button>
        <button
          onClick={() => {
            if (canvas && socket) {
              setTool(new Circle(canvas, socket, roomId))
            }
          }}
        >
          <CircleIcon color="black" />
        </button>
        <button
          onClick={() => {
            if (canvas && socket) {
              setTool(new Eraser(canvas, socket, roomId))
            }
          }}
        >
          <EraserIcon color="black" />
        </button>
        <button
          onClick={() => {
            if (canvas && socket) {
              setTool(new Line(canvas, socket, roomId))
            }
          }}
        >
          <Minus color="black" />
        </button>
        <input onChange={changeColor} style={{ marginLeft: 10 }} type="color" />
      </div>
      <div className="flex items-center gap-x-2">
        <button onClick={() => undo()}>
          <Undo2 color="black" />
        </button>
        <button onClick={() => redo()}>
          <Redo2 color="black" />
        </button>
        <button onClick={download}>
          <Save color="black" />
        </button>
      </div>
    </div>
  )
}
