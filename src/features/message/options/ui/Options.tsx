import { useModal } from '@/shared/model/modalStore'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { Edit, Trash } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface props {
  canEditMessage: boolean
  canDeleteMessage: boolean
  setIsEditing: Dispatch<SetStateAction<boolean>>
  modalData: { apiUrl: string; query: Record<string, string> }
}

export const Options = ({
  canEditMessage,
  canDeleteMessage,
  setIsEditing,
  modalData,
}: props) => {
  const { onOpen } = useModal()

  if (canDeleteMessage) {
    return (
      <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
        {canEditMessage && (
          <ActionTooltip label="Редактировать">
            <Edit
              onClick={() => setIsEditing(true)}
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        )}
        <ActionTooltip label="Удалить">
          <Trash
            onClick={() => onOpen('deleteMessage', modalData)}
            className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
          />
        </ActionTooltip>
      </div>
    )
  }
}
