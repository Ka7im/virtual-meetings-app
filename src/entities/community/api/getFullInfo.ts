import { db } from '@/shared/api/db'
import { RoomType } from '@prisma/client'
import { redirect } from 'next/navigation'

interface getFullInfoProps {
  communityId: string
  profileId: string
}

export const getFullInfo = async ({
  communityId,
  profileId,
}: getFullInfoProps) => {
  const community = await db.community.findUnique({
    where: {
      id: communityId,
    },
    include: {
      rooms: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  const textRooms = community?.rooms.filter(
    (room) => room.type === RoomType.TEXT,
  )
  const audioRooms = community?.rooms.filter(
    (room) => room.type === RoomType.AUDIO,
  )
  const videoRooms = community?.rooms.filter(
    (room) => room.type === RoomType.VIDEO,
  )
  const paintRooms = community?.rooms.filter(
    (room) => room.type === RoomType.PAINT,
  )
  const members = community?.members.filter(
    (member) => member.profileId !== profileId,
  )

  const role = community?.members.find(
    (member) => member.profileId === profileId,
  )?.role

  return { community, textRooms, audioRooms, videoRooms, paintRooms, members, role }
}
