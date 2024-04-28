'use client'

import { useChatQuery, useChatSocket } from '@/entities/chat'
import { Member, Message, Profile } from '@prisma/client'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Hash, Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'
import { useChatScroll } from '../lib/hooks/useChatScroll'
import { ChatItem } from './ChatItem'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'roomId' | 'conversationId'
  paramValue: string
  type: 'room' | 'conversation'
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramValue,
  paramKey,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  useChatSocket({ queryKey, addKey, updateKey })

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'pending') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Загрузка сообщений...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7  text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Что-то пошло не так...
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
        <div className="mb-4 space-y-2 px-4">
          {type === 'room' && (
            <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
              <Hash className="h-12 w-12 text-white" />
            </div>
          )}
          <p className="text-xl font-bold md:text-3xl">
            {type === 'room' ? 'Добро пожаловать в #' : ''}
            {name}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {type === 'room'
              ? `Это начало комнаты #${name}`
              : `Это начало диалога с ${name}.`}
          </p>
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Загрузка предыдущих сообщений
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT, {
                  locale: ru,
                })}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                currentMember={member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
