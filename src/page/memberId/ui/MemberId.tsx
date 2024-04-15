import { createOrFindConversation } from '@/entities/conversation'
import { getCurrentMember } from '@/entities/member'
import { currentProfile } from '@/entities/profile'
import { ChatHeader } from '@/widgets/chat'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface MemberIdProps {
  params: {
    memberId: string
    communityId: string
  }
}

export const MemberId = async ({ params }: MemberIdProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const currentMember = await getCurrentMember({
    communityId: params.communityId,
    profileId: profile.id,
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await createOrFindConversation(
    currentMember.id,
    params.memberId,
  )

  if (!conversation) {
    return redirect(`/communities/${params.communityId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        communityId={params.communityId}
        type="conversation"
      />{' '}
    </div>
  )
}
