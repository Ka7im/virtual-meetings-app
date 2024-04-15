import { db } from "@/shared/api/db";

export const createNewConversation = async (
  firstMemberId: string,
  secondMemberId: string,
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId: firstMemberId,
        memberTwoId: secondMemberId,
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
    });
  } catch {
    return null;
  }
};