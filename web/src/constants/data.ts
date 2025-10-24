import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Wallet',
    url: '/dashboard/wallet',
    icon: 'billing',
    shortcut: ['w', 'w'],
    isActive: false,
    items: []
  },
  {
    title: 'Automation',
    url: '/dashboard/automation',
    icon: 'laptop',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
];