'use client'

import { useModal } from '@/shared/model/modalStore'
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Plus, Smile } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface props {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'room'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const MessageInput = ({ apiUrl, query, name, type }: props) => {
  const { resolvedTheme } = useTheme()

  const { onOpen } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      })

      await axios.post(url, data)
      form.reset()
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      await onSubmit({ content: (event.target as HTMLInputElement).value })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <Input autoComplete="false" hidden className="hidden px-12 py-6" />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen('messageAttachment', {
                        apiUrl,
                        query,
                      })
                    }
                    className="absolute left-7 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    onInput={(event) => event.stopPropagation()}
                    onKeyDown={(event) => handleKeyDown(event)}
                    disabled={isLoading}
                    className="border-0 border-none bg-zinc-200/90 px-12 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    {...field}
                    placeholder={`Message ${
                      type === 'conversation' ? name : `#` + name
                    }`}
                  />
                  <div className="absolute right-7 top-7">
                    {/* <Popover>
                      <PopoverTrigger>
                        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        sideOffset={40}
                        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
                      >
                        <Picker
                          data={data}
                          theme={resolvedTheme}
                          onEmojiSelect={(emoji: string) =>
                            field.onChange(`${field.value}${emoji}`)
                          }
                        />
                      </PopoverContent>
                    </Popover> */}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
