'use client'

import { cn } from '@/shared/lib/utils'
import { ModalType, useModal } from '@/shared/model/modalStore'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { Room, RoomType, MemberRole, Community } from '@prisma/client'
import { Brush, Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface CommunityRoomProps {
  room: Room
  community: Community
  role?: MemberRole
}

const iconMap = {
  [RoomType.TEXT]: Hash,
  [RoomType.MEDIA]: Mic,
  [RoomType.PAINT]: Brush,
}

export const CommunityRoom = ({
  room,
  community,
  role,
}: CommunityRoomProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()
  const Icon = iconMap[room.type]

  const onClick = () => {
    router.push(`/communities/${params?.communityId}/rooms/${room.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { room, community })
  }

  return (
    <button
      onClick={() => onClick()}
      className={cn(
        'group relative mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-[#002e48]',
        params?.roomId === room.id && 'bg-zinc-700/20 dark:bg-[#002e48]',
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.roomId === room.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {room.name}
      </p>
      {room.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2 ">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
              onClick={(event) => onAction(event, 'editRoom')}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
              onClick={(event) => onAction(event, 'deleteRoom')}
            />
          </ActionTooltip>
        </div>
      )}
      {room.name === 'general' && (
        <Lock className="ml-auto hidden h-4 w-4 text-zinc-500 group-hover:block dark:text-zinc-400" />
      )}
    </button>
  )
}
