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
  [RoomType.MEDIA]: <Mic className="mr-2 h-4 w-4" />,
  [RoomType.PAINT]: <Brush className="mr-2 h-4 w-4" />,
}

export const CommunitySidebar = async ({
  communityId,
}: CommunitySidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }
  const { community, members, textRooms, mediaRooms, paintRooms, role } =
    await getCommunityFullInfo({
      communityId: communityId,
      profileId: profile.id,
    })

  if (!community) {
    redirect('/')
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#001629] border dark:border-[#002e48]">
      <CommunityHeader community={community} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SearchCommunity
            data={[
              {
                label: 'Текстовые комнаты',
                type: 'room',
                data: textRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Медиа комнаты',
                type: 'room',
                data: mediaRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Виртуальные доски',
                type: 'room',
                data: paintRooms?.map((room) => ({
                  id: room.id,
                  name: room.name,
                  icon: iconMap[room.type],
                })),
              },
              {
                label: 'Участники',
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
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-[#002e48]" />
        {!!textRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.TEXT}
              role={role}
              label="Текстовые комнаты"
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
        {!!mediaRooms?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="rooms"
              roomType={RoomType.MEDIA}
              role={role}
              label="Медиа комнаты"
            />
            <div className="space-y-[2px]">
              {mediaRooms.map((room) => (
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
              label="Виртуальные доски"
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
              label="Участники"
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
