import { Socket } from "socket.io-client"

export class Tool {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  socket?: WebSocket
  roomId?: string

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.socket = socket
    this.roomId = roomId

    this.destroyEvents()
  }

  set fillColor(color: string) {
    if (this.ctx) this.ctx.fillStyle = color
  }

  set strokeColor(color: string) {
    if (this.ctx) this.ctx.strokeStyle = color
  }

  set lineWidth(width: number) {
    if (this.ctx) this.ctx.lineWidth = width
  }

  destroyEvents() {
    this.canvas.onmousemove = null
    this.canvas.onmousedown = null
    this.canvas.onmouseup = null
  }
}