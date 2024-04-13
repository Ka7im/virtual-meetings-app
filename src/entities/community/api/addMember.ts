import { db } from '@/shared/api/db'

interface addMemberProps {
  inviteCode: string
  profileId: string
}
export const addMember = async ({ inviteCode, profileId }: addMemberProps) => {
  return db.community.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profileId,
          },
        ],
      },
    },
  })
}
