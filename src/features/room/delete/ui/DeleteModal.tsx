'use client'

import { useModal } from '@/shared/model/modalStore'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteRoom } from '../api/deleteRoom'

export const DeleteModal = ({}) => {
  const { isOpen, type, onClose, data } = useModal()

  const router = useRouter()

  const { community, room } = data

  const [loading, setLoading] = useState<boolean>(false)

  const isModalOpen = isOpen && type == 'deleteRoom'

  const onCancel = () => {
    onClose()
  }

  const onConfirm = async () => {
    try {
      if (room && community) {
        setLoading(true)

        await deleteRoom({ roomId: room.id, communityId: community.id })
        router.push(`/communities/${community?.id}`)
        router.refresh()
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Room
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Do you really want to do this? The {room?.type.toLowerCase()}
            -room{' '}
            <span className="font-semibold text-indigo-500  ">
              #{room?.name}
            </span>{' '}
            will be permamently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={loading}
              onClick={onCancel}
              variant="ghost"
              className="outline-none"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={onConfirm}
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
