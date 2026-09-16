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
  activeContext: 'organisation' | 'superadmin';

  // App Shell State
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  isDarkMode: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  notifications: NotificationItem[];

  // Live Clock In & Break State
  isClockedIn: boolean;
  clockInTime: string | null;
  secondsElapsed: number;
  isOnBreak: boolean;
  breakStartTime: string | null;
  breakSecondsElapsed: number;
  totalBreakSeconds: number;

  // Actions
  switchRole: (role: UserRole) => Promise<void>;
  switchOrg: (orgId: string) => Promise<void>;
  setActiveContext: (context: 'organisation' | 'superadmin') => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setClockInState: (active: boolean, time?: string) => void;
  toggleBreak: () => void;
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
  activeContext: initialUser.role === 'saas_owner' ? 'superadmin' : 'organisation',

  sidebarCollapsed: false,
  mobileMenuOpen: false,
  isDarkMode: initialDarkMode,
  commandPaletteOpen: false,
  notificationsOpen: false,
  notifications: INITIAL_NOTIFICATIONS,

  isClockedIn: false,
  clockInTime: null,
  secondsElapsed: 0,
  isOnBreak: false,
  breakStartTime: null,
  breakSecondsElapsed: 0,
  totalBreakSeconds: 0,

  switchRole: async (role: UserRole) => {
    const updatedUser = await authService.switchRole(role);
    set({
      currentUser: updatedUser,
      currentRole: role,
      activeContext: role === 'saas_owner' ? 'superadmin' : 'organisation',
    });
  },

  setActiveContext: (context: 'organisation' | 'superadmin') => {
    set({ activeContext: context });
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
    secondsElapsed: 0,
    isOnBreak: false,
    breakStartTime: null,
    breakSecondsElapsed: 0,
    totalBreakSeconds: 0,
  }),

  toggleBreak: () => {
    const { isOnBreak, breakStartTime, breakSecondsElapsed, totalBreakSeconds } = get();
    if (isOnBreak) {
      // Ending break
      set({
        isOnBreak: false,
        totalBreakSeconds: totalBreakSeconds + breakSecondsElapsed,
        breakStartTime: null,
        breakSecondsElapsed: 0,
      });
    } else {
      // Starting break
      set({
        isOnBreak: true,
        breakStartTime: new Date().toISOString(),
        breakSecondsElapsed: 0,
      });
    }
  },

  tickClockTimer: () => {
    const { isClockedIn, clockInTime, isOnBreak, breakStartTime, totalBreakSeconds } = get();
    if (isClockedIn) {
      const now = Date.now();
      if (isOnBreak && breakStartTime) {
        const breakStart = new Date(breakStartTime).getTime();
        set({ breakSecondsElapsed: Math.max(0, Math.floor((now - breakStart) / 1000)) });
      } else if (clockInTime) {
        const workStart = new Date(clockInTime).getTime();
        const totalElapsed = Math.floor((now - workStart) / 1000);
        set({ secondsElapsed: Math.max(0, totalElapsed - totalBreakSeconds) });
      }
    }
  },

  logout: async () => {
    await authService.logout();
    window.location.href = '/login';
  }
}));
