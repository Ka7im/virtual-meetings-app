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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { RoomType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { edit } from '../api/edit'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required.',
    })
    .max(12)
    .refine((name) => name !== 'general', {
      message: 'Room name cannot be "general"!',
    }),
  type: z.nativeEnum(RoomType),
})

export const EditModal = () => {
  const { isOpen, type, onClose, data } = useModal()
  const { community, room } = data

  const router = useRouter()

  const isModalOpen = isOpen && type == 'editRoom'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room?.name || '',
      type: room?.type || RoomType.TEXT,
    },
  })

  useLayoutEffect(() => {
    if (room) {
      form.setValue('name', room.name)
      form.setValue('type', room.type)
    }
  }, [form, room])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (room && community) {
        await edit({ roomId: room.id, communityId: community.id, data })
        form.reset()
        router.refresh()
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = async () => {
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Редактировать комнату
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Измените название или тип комнаты
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Название комнаты
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Введите название комнаты"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Тип комнаты
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(RoomType).map((type) => {
                          let itemText = 'Текст'

                          switch (type) {
                            case 'MEDIA':
                              itemText = 'Медиа'
                              break
                            case 'PAINT':
                              itemText = 'Виртуальная доска'
                              break
                          }

                          return (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {itemText}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
