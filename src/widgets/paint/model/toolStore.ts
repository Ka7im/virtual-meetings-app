import { create } from "zustand";
import { Tool } from "./tools/Tool";

interface ToolStore {
  setTool: (tool: Tool) => void
  setFillColor: (color: string) => void
  setStrokeColor: (color: string) => void
  setLineWidth: (width: number) => void
  tool: null | Tool
}

export const useTool = create<ToolStore>((set) => ({
  tool: null,
  setTool: (tool) =>
    set(() => ({
      tool
    })),
  setFillColor: (color) => set((state) => {
    const tool = state.tool

    if (tool) tool.fillColor = color

    return {
      tool
    }
  }),
  setStrokeColor: (color) => set((state) => {
    const tool = state.tool

    if (tool) tool.strokeColor = color

    return {
      tool
    }
  }),
  setLineWidth: (width) => set((state) => {
    const tool = state.tool

    if (tool) tool.lineWidth = width

    return {
      tool
    }
  })
}))