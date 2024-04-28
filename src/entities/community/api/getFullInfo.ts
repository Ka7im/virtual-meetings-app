import { db } from '@/shared/api/db'
import { RoomType } from '@prisma/client'

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
  const mediaRooms = community?.rooms.filter(
    (room) => room.type === RoomType.MEDIA,
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

  return { community, textRooms, mediaRooms, paintRooms, members, role }
}
