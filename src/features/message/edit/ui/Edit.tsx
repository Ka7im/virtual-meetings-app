import React from 'react'
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { Button } from '@/shared/ui/button'

interface EditProps {
  form: UseFormReturn<{ content: string }>
  onSubmit: SubmitHandler<{ content: string }>
  isLoading: boolean
}

export const Edit = ({ form, onSubmit, isLoading }: EditProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-x-2 pt-2"
      >
        <div className="flex w-full items-center gap-x-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      disabled={isLoading}
                      className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                      placeholder="Edited message"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button size="sm" variant="primary" disabled={isLoading}>
            Save
          </Button>
        </div>

        <span className="mt-1 text-[10px] text-zinc-400">
          Press ESC to cancel, ENTER to save
        </span>
      </form>
    </Form>
  )
}
