import { pagesCurrentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'
import { NextApiResponseServerIO } from '@/shared/types/io'

import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const profile = await pagesCurrentProfile(req)
    const { messageId, communityId, roomId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID Missing' })
    }

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID Missing' })
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
      return res.status(404).json({ error: 'Community not found' })
    }

    const room = await db.room.findFirst({
      where: {
        id: roomId as string,
        communityId: communityId as string,
      },
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    const member = community.members.find(
      (member) => profile.id === member.profileId,
    )

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        roomId: roomId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const isMessageOwner = message.member.profileId === profile.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isModerator || isMessageOwner || isAdmin

    if (!canModify) {
      return res.status(403).json({ error: 'Cannot modify message' })
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res
          .status(403)
          .json({ error: 'Only owner of message can modify it' })
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${roomId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.error('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
