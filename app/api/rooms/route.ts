import { currentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const profile = await currentProfile()
    const { name, type } = await req.json()

    const { searchParams } = new URL(req.url)
    const communityId = searchParams.get('communityId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!communityId) {
      return new NextResponse('Community ID missing', { status: 400 })
    }

    if (name === 'Главная') {
      return new NextResponse('Name cannot be "Главная"', { status: 400 })
    }

    const community = await db.community.update({
      where: {
        id: communityId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        rooms: {
          create: {
            profileId: profile.id,
            name: name,
            type: type,
          },
        },
      },
      include: {
        rooms: true,
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('ROOMS_POST_ERROR', error)
    return new NextResponse('Interntal Error', { status: 500 })
  }
}
