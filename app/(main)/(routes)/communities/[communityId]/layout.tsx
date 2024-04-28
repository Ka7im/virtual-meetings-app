import { getUniqueCommunity } from '@/entities/community'
import { currentProfile } from '@/entities/profile'
import { CommunitySidebar } from '@/widgets/communitySidebar'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const CommunitiesIdLayout = async ({
  children,
  params,
}: {
  children: ReactNode
  params: {
    communityId: string
  }
}) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const community = await getUniqueCommunity({
    communityId: params.communityId,
    profileId: profile.id,
  })

  if (!community) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex right-0">
        <CommunitySidebar communityId={params.communityId} />
      </div>
      <main className="h-full md:pr-60">{children}</main>
    </div>
  )
}

export default CommunitiesIdLayout
