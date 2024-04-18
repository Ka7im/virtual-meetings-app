import { createOrFindConversation } from '@/entities/conversation'
import { getCurrentMember } from '@/entities/member'
import { currentProfile } from '@/entities/profile'
import { MessageInput } from '@/features/message/input'
import { ChatHeader } from '@/widgets/chat'
import { ChatMessages } from '@/widgets/chat/ui/ChatMessages'
import { MediaRoom } from '@/widgets/mediaRoom'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface MemberIdProps {
  params: {
    memberId: string
    communityId: string
  }
  searchParams: {
    video?: boolean
  }
}

export const MemberId = async ({ params, searchParams }: MemberIdProps) => {
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
  console.log('searchParams', searchParams)

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        communityId={params.communityId}
        type="conversation"
      />
      {searchParams?.video && (
        <MediaRoom chatId={conversation.id} video audio />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <MessageInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}
