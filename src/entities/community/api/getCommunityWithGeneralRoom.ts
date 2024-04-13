import { db } from "@/shared/api/db"

export const getCommunityWithGeneralRoom = async ({ communityId, profileId }: { communityId: string, profileId: string }) => {
  return await db.community.findUnique({
    where: {
      id: communityId,
      members: {
        some: {
          profileId
        }
      }
    },
    include: {
      rooms: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })
}