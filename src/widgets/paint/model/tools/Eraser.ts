import { Brush } from "./Brush";


export default class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    super(canvas, socket, roomId);
  }


  draw(x: number, y: number) {
    if (this.ctx) {
      this.ctx.strokeStyle = "white"
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }
}