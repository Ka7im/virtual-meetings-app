'use client'

import { Canvas } from './Canvas'
import { SettingBar } from './SettingBar'
import { Toolbar } from './Toolbar'

type PaintWidgetProps = {
  roomId: string
  username: string
}

export const PaintWidget = ({ roomId, username }: PaintWidgetProps) => {
  return (
    <div className="h-full flex flex-col">
      <Toolbar roomId={roomId} />
      <SettingBar />
      <Canvas roomId={roomId} username={username} />
    </div>
  )
}
