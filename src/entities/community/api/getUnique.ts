import { db } from '@/shared/api/db'

export const getUnique = async ({
  communityId,
  profileId,
}: {
  communityId: string
  profileId: string
}) => {
  return db.community.findUnique({
    where: {
      id: communityId,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  })
}
