import { addMemberToCommunity } from '@/entities/community'
import { checkUserAlreadyInCommunity } from '@/entities/member'
import { currentProfile } from '@/entities/profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface InviteProps {
  params: {
    inviteCode: string
  }
}

export const Invite = async ({ params }: InviteProps) => {
  const profile = await currentProfile()
  console.log(params.inviteCode)

  if (!profile) {
    return redirectToSignIn()
  }

  if (!params.inviteCode) {
    return redirect('/')
  }

  const userAlreadyInCommunity = await checkUserAlreadyInCommunity({
    inviteCode: params.inviteCode,
    profileId: profile.id,
  })

  if (userAlreadyInCommunity) {
    return redirect(`/communities/${userAlreadyInCommunity.id}`)
  }

  const community = await addMemberToCommunity({
    inviteCode: params.inviteCode,
    profileId: profile.id,
  })

  if (community) {
    return redirect(`/communities/${community.id}`)
  }
}
