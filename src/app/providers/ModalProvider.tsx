'use client'

import { CreateCommunityModal } from '@/features/community/create'
import { InviteMemberModal } from '@/features/member/invite'
import { useMounting } from '@/shared/lib/hooks/useMounting'

export const ModalProvider = () => {
  useMounting()

  return (
    <>
      <CreateCommunityModal isClosable />
      <InviteMemberModal />
    </>
  )
}
