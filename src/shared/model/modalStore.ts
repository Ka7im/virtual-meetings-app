import { Community, Room, RoomType } from '@prisma/client'
import { create } from 'zustand'

export type ModalType =
  | 'createCommunity'
  | 'invite'
  | 'editCommunity'
  | 'users'
  | 'createRoom'
  | 'leaveCommunity'
  | 'deleteCommunity'
  | 'deleteRoom'
  | 'editRoom'
  | 'messageAttachment'
  | 'deleteMessage'

interface ModalData {
  community?: Community
  room?: Room
  roomType?: RoomType
  apiUrl?: string
  query?: Record<string, any>
}

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) =>
    set({
      isOpen: true,
      type,
      data,
    }),
  onClose: () => set({ type: null, isOpen: false }),
}))
