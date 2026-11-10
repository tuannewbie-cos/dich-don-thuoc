import { create } from 'zustand';
import { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'usr_hackathon_demo',
    name: 'Alex Rivers',
    email: 'alex.rivers@hackathon.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  isAuthenticated: true,
  setUser: (user) => set({ user }),
  logout: () =>
    set({
      user: { id: '', name: '', email: '', avatar: '' },
      isAuthenticated: false,
    }),
}));
