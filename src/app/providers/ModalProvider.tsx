'use client'

import { CreateCommunityModal } from '@/features/community/create'
import { DeleteCommunityModal } from '@/features/community/delete'
import { EditCommunityModal } from '@/features/community/edit'
import { LeaveFromCommunityModal } from '@/features/community/leave'
import { InviteMemberModal } from '@/features/member/invite'
import { ManageMembersModal } from '@/features/member/manage'
import { CreateRoomModal } from '@/features/room/create'
import { DeleteRoomModal } from '@/features/room/delete'
import { EditRoomModal } from '@/features/room/edit'
import { useMounting } from '@/shared/lib/hooks/useMounting'

export const ModalProvider = () => {
  useMounting()

  return (
    <>
      <CreateCommunityModal isClosable />
      <DeleteCommunityModal />
      <EditCommunityModal />
      <LeaveFromCommunityModal />

      <InviteMemberModal />
      <ManageMembersModal />

      <CreateRoomModal />
      <DeleteRoomModal />
      <EditRoomModal />
    </>
  )
}
