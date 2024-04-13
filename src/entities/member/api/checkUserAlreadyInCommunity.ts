import { db } from '@/shared/api/db'

interface checkUserAlreadyInCommunityProps {
  inviteCode: string
  profileId: string
}
export const checkUserAlreadyInCommunity = async ({
  inviteCode,
  profileId,
}: checkUserAlreadyInCommunityProps) => {
  return db.community.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  })
}
