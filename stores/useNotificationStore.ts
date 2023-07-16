import { create } from 'zustand'

interface NotificationState {
    notification: string
    type: string
    setNotification: (message: string, type: string) => void
}

export const useNotificationStore = create<NotificationState>() ((set) => ({
    notification: "",
    type: "",
    setNotification: (message, type) => set((state) => ({ notification: message, type: type}))
}))