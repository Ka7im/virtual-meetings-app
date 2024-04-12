import { CreateCommunityButton } from '@/features/community/create'

import { db } from '@/shared/api/db'
import { ModeToggle } from '@/shared/ui/ModeToggle'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Separator } from '@/shared/ui/separator'
import { redirect } from 'next/navigation'
import React from 'react'
import { SidebarItem } from './SidebarItem'
import { UserButton } from '@clerk/nextjs'
import { currentProfile } from '@/entities/profile'

export const Sidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const communities = await db.community.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="flex h-full w-full flex-col items-center justify-between space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
      <div className="flex flex-col gap-3">
        <ScrollArea className="w-full flex-1">
          {communities.map((community) => {
            return (
              <div key={community.id} className="mb-4">
                <SidebarItem
                  name={community.name}
                  imageUrl={community.imageUrl}
                  id={community.id}
                />
              </div>
            )
          })}
        </ScrollArea>
        <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
        <CreateCommunityButton />
      </div>

      <div className="z-50 mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  )
}
