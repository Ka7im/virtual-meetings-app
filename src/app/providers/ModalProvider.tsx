'use client'

import { CreateCommunityModal } from '@/features/community/create'
import { EditCommunityModal } from '@/features/community/edit'
import { InviteMemberModal } from '@/features/member/invite'
import { ManageMembersModal } from '@/features/member/manage'
import { CreateRoomModal } from '@/features/room'
import { useMounting } from '@/shared/lib/hooks/useMounting'

export const ModalProvider = () => {
  useMounting()

  return (
    <>
      <CreateCommunityModal isClosable />
      <InviteMemberModal />
      <EditCommunityModal />
      <ManageMembersModal />
      <CreateRoomModal />
    </>
  )
}
