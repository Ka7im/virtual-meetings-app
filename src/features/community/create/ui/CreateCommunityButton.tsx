'use client'

import { useModal } from '@/shared/model/modalStore'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { Plus } from 'lucide-react'
import React from 'react'

export const CreateCommunityButton = () => {
  const { onOpen } = useModal()

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Добавить сообщество">
        <button
          className="group flex items-center outline-none"
          onClick={() => onOpen('createCommunity')}
        >
          <div className="m-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-neutral-700 dark:bg-[#002e48]">
            <Plus
              className="text-[#001629] transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
