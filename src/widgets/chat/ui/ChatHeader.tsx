import { Avatar, AvatarImage } from '@/shared/ui/avatar'

import { UserButton } from '@clerk/nextjs'
import { Hash, Loader2 } from 'lucide-react'
import { BurgerMenu } from './BurgerMenu'
import { SocketIndicator } from '@/shared/ui/SocketIndicator'
import { ChatVideoButton } from '@/features/chat'

interface ChatHeaderProps {
  communityId: string
  name: string
  type: 'room' | 'conversation'
  imageUrl?: string
}

export const ChatHeader = ({
  communityId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 flex-row items-center justify-between border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <div className="flex w-full flex-row items-center">
        <BurgerMenu communityId={communityId} />
        {type === 'room' && (
          <>
            <Hash className="ml-4 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            <p className="text-md font-semibold text-black dark:text-white ">
              {name}
            </p>
            {/* {!isConnected && (
              <div className="ml-auto flex flex-row gap-[2px]">
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  connecting
                </p>
              </div>
            )} */}
          </>
        )}
        {type === 'conversation' && (
          <>
            <Avatar
              className={
                'ml-2 hidden  h-7 w-7 select-none md:block md:h-8 md:w-8'
              }
            >
              <AvatarImage src={imageUrl} />
            </Avatar>
            <p className="text-md mx-2 font-semibold text-black dark:text-white">
              {name}
            </p>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}
