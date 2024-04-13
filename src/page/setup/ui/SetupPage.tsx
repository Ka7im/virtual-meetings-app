import { getFirstCommunity } from '@/entities/community'
import { CreateCommunityModal } from '@/features/community/create'

import { initialProfile } from '@/features/profile'
import { redirect } from 'next/navigation'

export async function SetupPage() {
  const profile = await initialProfile()

  if (profile) {
    const community = await getFirstCommunity({ profileId: profile.id })

    if (community) {
      redirect(`/communities/${community.id}`)
    }
  }

  return (
    <>
      <CreateCommunityModal isClosable={false} />
    </>
  )
}
