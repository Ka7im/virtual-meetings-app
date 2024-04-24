import { getCommunityFullInfo } from '@/entities/community'
import { currentProfile } from '@/entities/profile'

import { ScrollArea } from '@/shared/ui/scroll-area'
import { Separator } from '@/shared/ui/separator'
import { RoomType, MemberRole } from '@prisma/client'
import { Brush, Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { redirect } from 'next/navigation'
import { CommunityHeader } from './CommunityHeader'
import { SearchCommunity } from './CommunitySearch'
import { CommunitySection } from './CommunitySection'
import { CommunityRoom } from './CommunityRoom'
import { CommunityMember } from './CommunityMember'

interface CommunitySidebarProps {
  communityId: string
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

const iconMap = {
  [RoomType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [RoomType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [RoomType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [RoomType.PAINT]: <Brush className="mr-2 h-4 w-4" />,
}

export const CommunitySidebar = async ({
  communityId,
}: CommunitySidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }
  const {
    community,
    members,
    videoRooms,
    textRooms,
    audioRooms,
    paintRooms,
    role,
  } = await getCommunityFullInfo({
    communityId: communityId,
    profileId: profile.id,
  })

  if (!community) {
    redirect('/')
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <CommunityHeader community={community} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SearchCommunity
            data={[
              {
                label: 'Text Rooms',
                type: 'room',
                data: textRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Audio Rooms',
                type: 'room',
                data: audioRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Video Rooms',
                type: 'room',
                data: videoRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Paint Rooms',
                type: 'room',
                data: paintRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.TEXT}
              role={role}
              label="Text Rooms"
            />
            <div className="space-y-[2px]">
              {textRooms.map((room) => (
                <CommunityRoom
                  key={room.id}
                  room={room}
                  community={community}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.TEXT}
              role={role}
              label="Audio Rooms"
            />
            <div className="space-y-[2px]">
              {audioRooms.map((room) => (
                <CommunityRoom
                  key={room.id}
                  room={room}
                  community={community}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.TEXT}
              role={role}
              label="Video Rooms"
            />
            <div className="space-y-[2px]">
              {videoRooms.map((room) => (
                <CommunityRoom
                  key={room.id}
                  room={room}
                  community={community}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!paintRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.TEXT}
              role={role}
              label="Paint Rooms"
            />
            <div className="space-y-[2px]">
              {paintRooms.map((room) => (
                <CommunityRoom
                  key={room.id}
                  room={room}
                  community={community}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="members"
              role={role}
              label="Members"
              community={community}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <CommunityMember
                  key={member.id}
                  member={member}
                  community={community}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
