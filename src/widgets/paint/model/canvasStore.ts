import { create } from "zustand";

interface CanvasStore {
  socket?: WebSocket
  setWebSocket: (ws: WebSocket) => void
  setCanvas: (canvas: HTMLCanvasElement) => void
  canvas: null | HTMLCanvasElement
  undoList: string[]
  redoList: string[]
  pushToUndo: (data: string) => void
  pushToRedo: (data: string) => void
  undo: () => void
  redo: () => void
}

export const useCanvas = create<CanvasStore>((set) => ({
  setWebSocket: (ws) => set((state) => ({ socket: ws })),
  canvas: null,
  undoList: [],
  redoList: [],
  setCanvas: (canvas) =>
    set((state) => ({
      canvas
    })),
  pushToUndo: (data) => set((state) => ({
    undoList: [...state.undoList, data]
  })),
  pushToRedo: (data) => set((state) => ({
    undoList: [...state.redoList, data]
  })),
  undo: () => set((state) => {
    let ctx = state.canvas?.getContext('2d')

    if (state.undoList.length > 0) {
      let [dataUrl] = state.undoList.slice(-1)
      let img = new Image()
      img.src = dataUrl
      img.onload = () => {
        if (state.canvas) {
          ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height)
          ctx?.drawImage(img, 0, 0, state.canvas.width, state.canvas.height)
        }
      }
    } else {
      if (state.canvas) {
        ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height)
      }
    }

    return {
      undoList: state.undoList.filter((_, index, arr) => index !== arr.length - 1),
      redoList: [...state.redoList, state.canvas?.toDataURL() || '']
    }
  }),
  redo: () => set((state) => {
    let ctx = state.canvas?.getContext('2d')

    if (state.redoList.length > 0) {
      let [dataUrl] = state.redoList.slice(-1)
      let img = new Image()
      img.src = dataUrl
      img.onload = () => {
        if (state.canvas) {
          ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height)
          ctx?.drawImage(img, 0, 0, state.canvas.width, state.canvas.height)
        }
      }
    }

    return {
      redoList: state.redoList.filter((_, index, arr) => index !== arr.length - 1),
      undoList: [...state.undoList, state.canvas?.toDataURL() || '']
    }
  })
}
))