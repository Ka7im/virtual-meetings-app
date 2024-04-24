import { Tool } from "./Tool";

export class Rect extends Tool {
  private mouseDown = false
  private startX?: number
  private startY?: number
  private saved?: string
  private width?: number
  private height?: number

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    super(canvas, socket, roomId)
    this.listen()
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  mouseUpHandler() {
    this.mouseDown = false
    this.socket?.send(JSON.stringify({
      method: 'draw',
      id: this.roomId,
      figure: {
        type: 'rect',
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
        color: this.ctx?.fillStyle
      }
    }))

  }
  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true

    if (this.ctx && e) {
      this.ctx.beginPath()
      this.ctx.moveTo(e.offsetX, e.offsetY)
      this.startX = e.offsetX
      this.startY = e.offsetY
      this.saved = this.canvas.toDataURL()
    }

  }
  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown && this.ctx && this.startX && this.startY) {
      let currentX = e.offsetX
      let currentY = e.offsetY
      this.width = currentX - this.startX
      this.height = currentY - this.startY
      this.draw(this.startX, this.startY, this.width, this.height)
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image()
    if (this.saved) img.src = this.saved
    img.onload = () => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.beginPath()
      this.ctx?.rect(x, y, w, h)
      this.ctx?.fill()
      this.ctx?.stroke()
    }
  }

  static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
  }
}