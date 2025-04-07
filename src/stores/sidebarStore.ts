
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isSidebarOpen: boolean;
  isAnimating: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setAnimating: (isAnimating: boolean) => void;
}

// Create sidebar store with persistence
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isSidebarOpen: false, // Default is closed for a cleaner look
      isAnimating: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen, isAnimating: true })),
      openSidebar: () => set({ isSidebarOpen: true, isAnimating: true }),
      closeSidebar: () => set({ isSidebarOpen: false, isAnimating: true }),
      setAnimating: (isAnimating: boolean) => set({ isAnimating }),
    }),
    {
      name: 'crypto-sidebar-storage',
      partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
    }
  )
);
