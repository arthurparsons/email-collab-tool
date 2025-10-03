export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  cursorPosition?: number;
}

export const collaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277273764_482a9c81.webp',
    color: '#4f46e5',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277275500_2a6a3666.webp',
    color: '#10b981',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277277210_7957ab49.webp',
    color: '#f59e0b',
    isOnline: true,
  },
  {
    id: '4',
    name: 'James Park',
    email: 'james.park@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277279072_fe021dd5.webp',
    color: '#ef4444',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Aisha Patel',
    email: 'aisha.p@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277280773_551e99b6.webp',
    color: '#8b5cf6',
    isOnline: true,
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david.kim@company.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277282513_0ce4a54e.webp',
    color: '#ec4899',
    isOnline: false,
  },
];
