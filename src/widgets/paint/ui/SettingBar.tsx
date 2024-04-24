'use clinet'

import React from 'react'
import { useTool } from '../model/toolStore'

export const SettingBar = () => {
  const setLineWidth = useTool((state) => state.setLineWidth)
  const setStrokeColor = useTool((state) => state.setStrokeColor)

  return (
    <div className="h-10 flex items-center bg-white shadow-inner px-4">
      <label htmlFor="line-width" className="text-black pr-2">
        Толщина линии
      </label>
      <input
        type="number"
        onChange={(e) => setLineWidth(+e.target.value)}
        id="line-width"
        defaultValue={1}
        min={1}
        max={50}
      />
      <label htmlFor="stroke-color" className="text-black pl-2">
        Цвет обводки
      </label>
      <input
        onChange={(e) => setStrokeColor(e.target.value)}
        id="stroke-color"
        type="color"
      />
    </div>
  )
}
