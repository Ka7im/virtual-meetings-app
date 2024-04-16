import { Popover, PopoverContent, PopoverTrigger } from './popover'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const {resolvedTheme} = useTheme()

  return (
    <Popover>
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
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}
