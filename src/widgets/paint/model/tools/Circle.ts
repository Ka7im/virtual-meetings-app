import { Tool } from "./Tool";



export class Circle extends Tool {
  private mouseDown = false
  private startX?: number
  private startY?: number
  private saved?: string

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.listen()
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true
    let canvasData = this.canvas.toDataURL()
    this.ctx?.beginPath()
    this.startX = e.offsetX
    this.startY = e.offsetY
    this.saved = canvasData
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown && this.ctx && this.startX && this.startY) {
      let curentX = e.offsetX
      let curentY = e.offsetY
      let width = curentX - this.startX
      let height = curentY - this.startY
      let r = Math.sqrt(width ** 2 + height ** 2)
      this.draw(this.startX, this.startY, r)
    }
  }

  draw(x: number, y: number, r: number) {
    const img = new Image()
    if (this.saved) img.src = this.saved
    img.onload = () => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.beginPath()
      this.ctx?.arc(x, y, r, 0, 2 * Math.PI)
      this.ctx?.fill()
      this.ctx?.stroke()
    }
  }
}