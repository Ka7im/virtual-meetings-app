import { currentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'

import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const communityId = searchParams.get('communityId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!communityId) {
      return new NextResponse('Community ID missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const community = await db.community.update({
      where: {
        id: communityId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.log('[MEMBER_DELETE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const { role } = await req.json()
    const communityId = searchParams.get('communityId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!communityId) {
      return new NextResponse('Community ID Missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID Missing', { status: 400 })
    }
    const community = await db.community.update({
      where: {
        id: communityId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[MEMBER_ROLE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
