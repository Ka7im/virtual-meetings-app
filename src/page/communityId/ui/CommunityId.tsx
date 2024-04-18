import { getCommunityWithGeneralRoom } from '@/entities/community/api/getCommunityWithGeneralRoom'
import { currentProfile } from '@/entities/profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface CommunityIdProps {
  params: {
    communityId: string
  }
}

export const CommunityId = async ({ params }: CommunityIdProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const community = await getCommunityWithGeneralRoom({
    communityId: params.communityId,
    profileId: profile.id,
  })

  const generalChannel = community?.rooms[0]

  if (generalChannel?.name !== 'general') {
    return null
  }

  return redirect(`/communities/${community?.id}/rooms/${generalChannel?.id}`)
}
