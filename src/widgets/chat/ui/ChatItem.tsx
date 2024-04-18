'use client'

import { Avatar, AvatarImage } from '@/shared/ui/avatar'
import { Skeleton } from '@/shared/ui/skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { Member, Profile } from '@prisma/client'
import axios from 'axios'
import { FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react'
import NextImage from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { conditions } from '../lib/useConditions'
import { ActionTooltip } from '@/shared/ui/ActionTooltip'
import { cn } from '@/shared/lib/utils'
import { MessageOptions } from '@/features/message/options'
import { MessageEdit } from '@/features/message/edit'

interface ChatMessagesProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatMessagesProps) => {
  const [isLoadingImage, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  })

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [content])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const { canDeleteMessage, canEditMessage, isPDF, isImage } = conditions(
    fileUrl,
    currentMember,
    deleted,
    member,
  )

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, values)

      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    }
  }

  const params = useParams()
  const router = useRouter()

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return
    }

    router.push(
      `/communities/${params?.communityId}/conversations/${member.id}`,
    )
  }

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          className="cursor-pointer transition hover:drop-shadow-md"
          onClick={onMemberClick}
        >
          <Avatar className={'h-7 w-7 select-none md:h-10 md:w-10'}>
            <AvatarImage src={member.profile.imageUrl} />
          </Avatar>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="cursor-pointer text-sm font-semibold hover:underline"
                onClick={onMemberClick}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              {isLoadingImage && (
                <Skeleton className="h-full w-full bg-gray-400" />
              )}
              <NextImage
                src={fileUrl as string}
                fill
                alt={content}
                className="object-cover"
                // placeholder="blur"
                onLoad={() => setIsLoading(true)}
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mx-4 mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="pointer h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400',
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <MessageEdit
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
      <MessageOptions
        canEditMessage={canEditMessage}
        canDeleteMessage={canDeleteMessage}
        setIsEditing={setIsEditing}
        modalData={{ apiUrl: `${socketUrl}/${id}`, query: socketQuery }}
      />
    </div>
  )
}
