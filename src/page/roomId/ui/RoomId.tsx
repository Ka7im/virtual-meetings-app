import { getCurrentMember } from '@/entities/member'
import { currentProfile } from '@/entities/profile'
import { getRoom } from '@/entities/room'
import { MessageInput } from '@/features/message/input'
import { ChatHeader } from '@/widgets/chat'
import { ChatMessages } from '@/widgets/chat/ui/ChatMessages'
import { MediaRoom } from '@/widgets/mediaRoom'
import { Paint } from '@/widgets/paint'
import { redirectToSignIn } from '@clerk/nextjs'
import { RoomType } from '@prisma/client'
import { redirect } from 'next/navigation'

interface RoomIdProps {
  params: {
    communityId: string
    roomId: string
  }
}

export const RoomId = async ({ params }: RoomIdProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const room = await getRoom({ roomId: params.roomId })

  const currentMember = await getCurrentMember({
    communityId: params.communityId,
    profileId: profile.id,
  })

  if (!room || !currentMember) {
    redirect('/')
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338] justify-between">
      <ChatHeader name={room.name} communityId={room.communityId} type="room" />
      {room.type === RoomType.TEXT && (
        <>
          <ChatMessages
            member={currentMember}
            name={room.name}
            chatId={room.id}
            type="room"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              roomId: room.id,
              communityId: room.communityId,
            }}
            paramKey="roomId"
            paramValue={room.id}
          />
          <MessageInput
            name={room.name}
            type="room"
            apiUrl="/api/socket/messages"
            query={{
              roomId: room.id,
              communityId: room.communityId,
            }}
          />
        </>
      )}
      {room.type === RoomType.AUDIO && (
        <MediaRoom chatId={room.id} video={false} audio={true} />
      )}
      {room.type === RoomType.VIDEO && (
        <MediaRoom chatId={room.id} video={true} audio={true} />
      )}
      {room.type === RoomType.PAINT && (
        <Paint roomId={room.id} username={profile.name} />
      )}
    </div>
  )
}
