import { currentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'

import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const communityId = searchParams.get('communityId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.roomId) {
      return new NextResponse('Room ID Missing', { status: 400 })
    }

    if (!communityId) {
      return new NextResponse('Community ID Missing', { status: 400 })
    }

    const community = await db.community.update({
      where: {
        id: communityId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        rooms: {
          delete: {
            id: params.roomId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[ROOM_DELETE_ERROR]', error)
    return new NextResponse('Interntal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const communityId = searchParams.get('communityId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.roomId) {
      return new NextResponse('Room ID Missing', { status: 400 })
    }

    if (!communityId) {
      return new NextResponse('Community ID Missing', { status: 400 })
    }

    if (name === 'general') {
      return new NextResponse("Cannot edit a room with name 'general'", {
        status: 400,
      })
    }

    const community = await db.community.update({
      where: {
        id: communityId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        rooms: {
          update: {
            where: {
              id: params.roomId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name: name,
              type: type,
            },
          },
        },
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[ROOM_UPDATE_ERROR]', error)
    return new NextResponse('Interntal Error', { status: 500 })
  }
}
