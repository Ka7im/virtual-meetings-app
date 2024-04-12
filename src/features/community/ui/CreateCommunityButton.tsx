import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { Plus } from 'lucide-react'
import React from 'react'

export const CreateCommunityButton = () => {
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a community">
        <button className="group flex items-center outline-none ">
          <div className="m-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-blue-500 dark:bg-neutral-700">
            <Plus
              className="text-blue-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
