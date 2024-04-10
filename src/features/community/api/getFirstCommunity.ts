import { db } from "@/shared/api/db"

export const getFirstCommunity = async ({ profileId }: { profileId: string }) => {
  return await db.community.findFirst({
    where: {
      profileId
    }
  })
}