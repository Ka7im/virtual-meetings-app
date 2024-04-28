'use client'

import { useModal } from '@/shared/model/modalStore'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useOrigin } from '@/shared/lib/hooks/useOrigin'
import { getNewInviteCode } from '@/entities/community/api/getNewInviteCode'
import { useMounting } from '@/shared/lib/hooks/useMounting'

export const InviteModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal()

  useMounting()
  const origin = useOrigin()

  const { community } = data

  const inviteUrl = `${origin}/invite/${community?.inviteCode}`

  const [copied, setCopied] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onNew = async () => {
    try {
      if (community) {
        setLoading(true)
        const response = await getNewInviteCode(community?.id)

        onOpen('invite', { community: response.data })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const isModalOpen = isOpen && type == 'invite'

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Пригласить друзей
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Приглашайте друзей в свое сообщество!
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 ">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            ссылка для приглашения в сообщество
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={loading}
              readOnly
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={loading} size="icon" onClick={onCopy}>
              {copied ? (
                <Check className="h-6 w-6" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={loading}
            variant="link"
            size="sm"
            className="mt-4 text-xs text-zinc-500"
          >
            Создайте новую ссылку
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
