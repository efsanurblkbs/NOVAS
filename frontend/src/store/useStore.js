import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      notifications: [],
      unreadCount: 0,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setNotifications: (notifications) => {
        // Tüm bildirimleri (Takip, Onay/Red sonucu ve İstekler) "Okunmamış" say
        const unread = notifications.length;
        set({ notifications, unreadCount: unread });
      },
      logout: () => set({ user: null, token: null, notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'novas-storage', // unique name
    }
  )
);

export default useStore;
