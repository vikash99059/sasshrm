import { create } from 'zustand';
import { User, UserRole, Organization, NotificationItem } from '../types';
import { authService } from '../services/authService';
import { INITIAL_NOTIFICATIONS } from '../services/mockDb';

interface AppState {
  // Auth & Context
  currentUser: User;
  currentRole: UserRole;
  currentOrg: Organization;
  allOrgs: Organization[];
  allDemoUsers: User[];
  
  // App Shell State
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  isDarkMode: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  notifications: NotificationItem[];
  
  // Live Clock In State
  isClockedIn: boolean;
  clockInTime: string | null;
  secondsElapsed: number;
  
  // Actions
  switchRole: (role: UserRole) => Promise<void>;
  switchOrg: (orgId: string) => Promise<void>;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setClockInState: (active: boolean, time?: string) => void;
  tickClockTimer: () => void;
  logout: () => Promise<void>;
}

const initialUser = authService.getCurrentUser();
const allOrgs = authService.getAllOrganizations();
const currentOrg = allOrgs.find(o => o.id === initialUser.organizationId) || allOrgs[0];
const initialDarkMode = localStorage.getItem('hrm_theme') === 'dark' || (!localStorage.getItem('hrm_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: initialUser,
  currentRole: initialUser.role,
  currentOrg: currentOrg,
  allOrgs: allOrgs,
  allDemoUsers: authService.getAllDemoUsers(),

  sidebarCollapsed: false,
  mobileMenuOpen: false,
  isDarkMode: initialDarkMode,
  commandPaletteOpen: false,
  notificationsOpen: false,
  notifications: INITIAL_NOTIFICATIONS,

  isClockedIn: false,
  clockInTime: null,
  secondsElapsed: 0,

  switchRole: async (role: UserRole) => {
    const updatedUser = await authService.switchRole(role);
    set({
      currentUser: updatedUser,
      currentRole: role,
    });
  },

  switchOrg: async (orgId: string) => {
    const { user, org } = await authService.switchOrganization(orgId);
    set({
      currentUser: user,
      currentOrg: org,
    });
  },

  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  toggleDarkMode: () => set(state => {
    const nextDark = !state.isDarkMode;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hrm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hrm_theme', 'light');
    }
    return { isDarkMode: nextDark };
  }),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),

  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
  })),

  markAllNotificationsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
  })),

  setClockInState: (active, time) => set({
    isClockedIn: active,
    clockInTime: time || (active ? new Date().toISOString() : null),
    secondsElapsed: active ? 0 : 0,
  }),

  tickClockTimer: () => {
    const { isClockedIn, clockInTime } = get();
    if (isClockedIn && clockInTime) {
      const start = new Date(clockInTime).getTime();
      const now = Date.now();
      set({ secondsElapsed: Math.max(0, Math.floor((now - start) / 1000)) });
    }
  },

  logout: async () => {
    await authService.logout();
    window.location.href = '/login';
  }
}));
