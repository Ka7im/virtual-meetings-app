import { Tool } from "./Tool";

export class Brush extends Tool {
  private mouseDown = false

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    super(canvas, socket, roomId)
    this.listen()
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false
    this.socket?.send(JSON.stringify({
      method: 'draw',
      id: this.roomId,
      figure: {
        type: 'finish',
      }
    }))
  }
  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true

    if (this.ctx && e) {
      this.ctx.beginPath()
      this.ctx.moveTo(e.offsetX, e.offsetY)
    }

  }
  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown && this.ctx) {

      this.socket?.send(JSON.stringify({
        method: 'draw',
        id: this.roomId,
        figure: {
          type: 'brush',
          x: e.offsetX,
          y: e.offsetY
        }
      }))
    }
  }

  static draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}