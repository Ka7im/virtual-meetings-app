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
import { useModal } from '@/shared/model/modalStore'
import { useMounting } from '@/shared/lib/hooks/useMounting'
import { useEffect } from 'react'
import { edit } from '../api/edit'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Community name is required.' }),
  imageUrl: z.string().min(1, { message: 'Community image is required.' }),
})

export const EditModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()

  const { community } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (community) {
      form.setValue('name', community.name)
      form.setValue('imageUrl', community.imageUrl)
    }
  }, [community, form])

  useMounting()

  const isModalOpen = isOpen && type === 'editCommunity'

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (community) {
        await edit({ data: values, communityId: community?.id })

        form.reset()
        router.refresh()
        onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your community
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your community a personality with a name and an image. You can
            always change it later.
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
                      Community name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter community name"
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
