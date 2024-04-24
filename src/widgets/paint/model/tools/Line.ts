import { Tool } from "./Tool";



export default class Line extends Tool {
  public name?: string

  private mouseDown = false
  private currentX?: number
  private currentY?: number
  private saved?: string

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.listen()
    this.name = 'Line'
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true
    this.currentX = e.offsetX
    this.currentY = e.offsetY
    this.ctx?.beginPath()
    this.ctx?.moveTo(this.currentX, this.currentY)
    this.saved = this.canvas.toDataURL()
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      this.draw(e.offsetX, e.offsetY);
    }
  }


  draw(x: number, y: number) {
    const img = new Image()
    if (this.saved) img.src = this.saved
    img.onload = () => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx?.beginPath()
      if (this.currentX && this.currentY) this.ctx?.moveTo(this.currentX, this.currentY)
      this.ctx?.lineTo(x, y)
      this.ctx?.stroke()
    }
  }
}