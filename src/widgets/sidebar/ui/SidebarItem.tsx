'use client'

import { cn } from '@/shared/lib/utils'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface SidebarItemProps {
  id: string
  imageUrl: string
  name: string
}

export const SidebarItem = ({ id, name, imageUrl }: SidebarItemProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/communities/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex items-center outline-none"
      >
        <div
          className={cn(
            'rounder-r-full absolute left-0 w-[4px] rounded-r-md bg-primary transition-all',
            params?.communityId !== id && 'group-hover:h-[20px]',
            params?.communityId === id ? 'h-[34px]' : 'h-[8px]',
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.community === id &&
              'rounded-[16px] bg-primary/10 text-primary',
          )}
        >
          <Image
            fill
            src={imageUrl}
            placeholder="blur"
            alt="Channel"
            blurDataURL={imageUrl}
            sizes="48px"
            priority
          />
        </div>
      </button>
    </ActionTooltip>
  )
}
