'use client'

import { useModal } from '@/shared/model/modalStore'
import { CommunityWithMembersWithProfiles } from '@/shared/types/community'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

import { MemberRole } from '@prisma/client'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus2,
  Users,
} from 'lucide-react'

interface CommunityHeaderProps {
  community: CommunityWithMembersWithProfiles
  role?: MemberRole
}

export const CommunityHeader = ({ community, role }: CommunityHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 transition  hover:bg-zinc-700/10 dark:border-[#002e48] dark:hover:bg-[#002e48]">
            {community.name}
            <ChevronDown className="ml-auto hidden h-5 w-5 md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-md w-56 space-y-[2px] text-xs text-black dark:text-neutral-400">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('invite', { community })}
              className="flex cursor-pointer justify-between px-3  py-2 text-indigo-600 dark:text-indigo-400"
            >
              Пригласить людей
              <UserPlus2 className="h-6 w-6" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer justify-between px-3 py-2 dark:text-white"
              onClick={() => onOpen('editCommunity', { community })}
            >
              Настройки сообщества
              <Settings className="h-6 w-6" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="flex cursor-pointer justify-between px-3 py-2 dark:text-white"
              onClick={() => onOpen('members', { community })}
            >
              Управление участниками
              <Users className="h-6 w-6" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="flex cursor-pointer justify-between px-3 py-2 dark:text-white"
              onClick={() => onOpen('createRoom')}
            >
              Создать комнату
              <PlusCircle className="h-6 w-6" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer justify-between px-3 py-2 text-rose-500"
              onClick={() => onOpen('deleteCommunity', { community })}
            >
              Удалить сообщество
              <Trash className="h-6 w-6" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              className="flex cursor-pointer justify-between  px-3 py-2 text-rose-500"
              onClick={() => onOpen('leaveCommunity', { community })}
            >
              Покинуть сообщество
              <LogOut className="h-6 w-6" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
