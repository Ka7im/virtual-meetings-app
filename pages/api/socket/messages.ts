import { pagesCurrentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'
import { NextApiResponseServerIO } from '@/shared/types/io'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method now allowed' })
  }
  try {
    console.log('SOCKET HEADERS', req.headers)

    const profile = await pagesCurrentProfile(req)
    const { communityId, roomId } = req.query
    const { content, fileUrl } = req.body

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!communityId) {
      return res.status(40).json({ error: 'Community ID Missing' })
    }

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID Missing' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content Missing' })
    }

    const community = await db.community.findFirst({
      where: {
        id: communityId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!community) {
      return res.status(404).json({ message: 'Community Not Found' })
    }

    const room = await db.room.findFirst({
      where: {
        id: roomId as string,
        communityId: communityId as string,
      },
    })

    if (!room) {
      return res.status(404).json({ message: 'Room Not Found' })
    }

    const member = community.members.find(
      (member) => member.profileId === profile.id,
    )

    if (!member) {
      return res
        .status(403)
        .json({ message: 'You cannot access this community' })
    }

    const message = await db.message.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        roomId: roomId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    const key = `chat:${roomId}:messages`

    res?.socket?.server?.io?.emit(key, message)

    return res.status(200).json(message)
  } catch (error) {
    console.error('[MESSAGES_POST]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
