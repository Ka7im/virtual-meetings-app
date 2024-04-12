import { getFirstCommunity } from '@/features/community/api/getFirstCommunity'
import { initialProfile } from '@/features/profile/api/intialProfile'
import { redirect } from 'next/navigation'
import InitialModal from './InitialModal'

export async function SetupPage() {
  const profile = await initialProfile()

  if (profile) {
    const community = await getFirstCommunity({ profileId: profile.id })

    if (community) {
      redirect(`/communities/${community.id}`)
    }
  }

  return <InitialModal />
}
