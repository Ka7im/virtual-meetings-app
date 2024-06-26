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
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createRoom } from '../api/createRoom'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required.',
    })
    .max(12)
    .refine((name) => name !== 'Главная', {
      message: 'Room name cannot be "Главная"!',
    }),
  type: z.nativeEnum(RoomType),
})

export const CreateModal = ({}) => {
  const { isOpen, type, onClose, data } = useModal()
  const { roomType } = data
  const router = useRouter()
  const params = useParams()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: roomType || RoomType.TEXT,
    },
  })

  useEffect(() => {
    if (roomType) {
      form.setValue('type', roomType)
    } else {
      form.setValue('type', RoomType.TEXT)
    }
  }, [roomType, form])

  const isModalOpen = isOpen && type == 'createRoom'

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (params && params.communityId) {
        await createRoom({ data, communityId: params.communityId as string })
      }
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = async () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Настройте свое сообщество
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Создайте комнату
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
                Создать
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
