'use client'

import { socketContext } from '@/shared/api/socket'
import { ReactNode, useEffect, useState } from 'react'
import { io as ClientIO, Socket } from 'socket.io-client'

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL || '', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <socketContext.Provider value={{ socket, isConnected }}>
      {children}
    </socketContext.Provider>
  )
}
