import { db } from '@/shared/api/db'

export const getRoom = async ({ roomId }: { roomId: string }) => {
  return db.room.findUnique({
    where: {
      id: roomId,
    },
  })
}
