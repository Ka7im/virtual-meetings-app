import { currentProfile } from '@/entities/profile'

import { db } from '@/shared/api/db'
import { NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, imageUrl } = await req.json()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const community = await db.community.update({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[COMMUNITY_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
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

    const community = await db.community.findFirst({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
    })
    const imageId = community?.imageUrl.split('/').pop() as string

    const utapi = new UTApi()
    await utapi.deleteFiles(imageId)

    await db.community.delete({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
    })
    const firstCommunity = await db.community.findFirst({
      where: {
        id: {
          not: params.communityId,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    })
    if (firstCommunity) {
      return NextResponse.json(`/communities/${firstCommunity.id}`)
    }
    return NextResponse.json(`/`)
  } catch (error) {
    console.error('[COMMUNITY_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
