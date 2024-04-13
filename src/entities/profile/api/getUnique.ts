import { auth } from '@clerk/nextjs'
import { db } from '../../../shared/api/db'

export const getUnique = async (): Promise<typeof profile | null> => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const profile = await db.profile.findUnique({ where: { userId } })

  return profile
}
