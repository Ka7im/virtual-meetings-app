'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/shared/ui/dialog'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

import { FileUpload } from '@/shared/ui/FileUpload'
import { useRouter } from 'next/navigation'
import { createCommunity } from '../api/createComminity'
import { useModal } from '@/shared/model/modalStore'
import { useEffect, useState } from 'react'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Community name is required.' }),
  imageUrl: z.string().min(1, { message: 'Community image is required.' }),
})

interface CreateCommunityModalProps {
  isClosable: boolean
}

export const CreateCommunityModal = ({
  isClosable,
}: CreateCommunityModalProps) => {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'createCommunity'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCommunity(values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isClosable) {
      setIsMounted(true)
    }
  }, [])

  if (!isMounted && !isClosable) {
    return null
  }

  return (
    <Dialog open={isClosable ? isModalOpen : true} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Настройте свое сообщество
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Придайте своему сообществу индивидуальность с помощью названия и
            изображения. Вы всегда можете изменить его позже
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="communityImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Название сообщества
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Введите название сообщества"
                        {...field}
                      />
                    </FormControl>
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
