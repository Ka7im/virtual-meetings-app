import { currentProfile } from '@/entities/profile'
import { db } from '@/shared/api/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const community = await db.community.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        rooms: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('[COMMUNITIES_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
