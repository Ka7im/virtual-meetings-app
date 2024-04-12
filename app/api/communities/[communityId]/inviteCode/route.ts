import { currentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } },
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.communityId) {
      return new NextResponse('Community ID Missing', { status: 400 })
    }

    const community = await db.community.update({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[COMMUNITY_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
