import { currentProfile } from '@/entities/profile';

import { db } from '@/shared/api/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.communityId) {
      return new NextResponse('Community ID Missing', { status: 400 });
    }

    const community = await db.community.update({
      where: {
        id: params.communityId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

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
    });

    if (firstCommunity) {
      return NextResponse.json(`/communities/${firstCommunity.id}`);
    }

    return NextResponse.json(`/`);
  } catch (error) {
    console.error('[COMMUNITY_LEAVE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}