import { db } from '@/shared/api/db'

export const getCurrentMember = async ({
  communityId,
  profileId,
}: {
  communityId: string
  profileId: string
}) => {
  return db.member.findFirst({
    where: {
      communityId,
      profileId,
    },
    include: {
      profile: true
    }
  })
}
