'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { MemberRole } from '@prisma/client'
import axios from 'axios'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'
import { Avatar, AvatarImage } from '@/shared/ui/avatar'
import { useModal } from '@/shared/model/modalStore'
import { CommunityWithMembersWithProfiles } from '@/shared/types/community'
import { updateRole } from '../api/updateRole'
import { deleteMember } from '../api/deleteMember'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
}

export const ManageModal = () => {
  const router = useRouter()
  const { onOpen, isOpen, onClose, type, data } = useModal()
  const [loadingId, setLoadingId] = useState('')

  const isModalOpen = isOpen && type === 'members'
  const { community } = data as { community: CommunityWithMembersWithProfiles }

  const onChangeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      const response = await updateRole({
        memberId,
        communityId: community.id,
        role,
      })
      router.refresh()
      onOpen('members', { community: response.data })
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId('')
    }
  }

  const onMemberKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)

      const response = await deleteMember({
        memberId,
        communityId: community.id,
      })

      router.refresh()
      onOpen('members', { community: response.data })
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Управление участниками
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Количество участников: {community?.members?.length}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {community?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <Avatar className={'h-7 w-7 select-none md:h-10 md:w-10'}>
                <AvatarImage src={member.profile.imageUrl} />
              </Avatar>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {community.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 h-4 w-4" />
                            <span>Роль</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onChangeRole(member.id, 'GUEST')}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Гость
                                {member.role === 'GUEST' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onChangeRole(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Модератор
                                {member.role === 'MODERATOR' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onMemberKick(member.id)}
                        >
                          <Gavel className="mr-2 h-4 w-4" />
                          Исключить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
