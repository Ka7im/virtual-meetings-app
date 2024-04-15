import { db } from '@/shared/api/db'

export const findConversation = async (
  firstMemberId: string,
  secondMemberId: string,
) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: firstMemberId }, { memberTwoId: secondMemberId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}
