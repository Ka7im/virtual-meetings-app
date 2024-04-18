'use client'

import { useModal } from '@/shared/model/modalStore'
import { CommunityWithMembersWithProfiles } from '@/shared/types/community'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { RoomType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'

interface CommunitySectionProps {
  label: string
  role?: MemberRole
  sectionType: 'rooms' | 'members'
  roomType?: RoomType
  community?: CommunityWithMembersWithProfiles
}

export const CommunitySection = ({
  label,
  role,
  sectionType,
  roomType,
  community,
}: CommunitySectionProps) => {
  const { onOpen } = useModal()
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'rooms' && (
        <ActionTooltip label="Create Room" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('createRoom')}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('members', { community })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}
