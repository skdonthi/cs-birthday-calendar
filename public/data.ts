import { Friend } from '../src/app/models/friend';
const today = new Date();
export const INITIAL_FRIENDS_LIST: Friend[] = [
  {
    firstName: 'shiva',
    birthDay: 14,
    birthMonth: 11,
    birthYear: 1994,
    id: 1732112102606,
  },
  {
    firstName: 'krishna',
    birthDay: 14,
    birthMonth: 8,
    birthYear: null,
    id: 1732112113840,
  },
  {
    firstName: 'cs-bc',
    birthDay: today.getDate(),
    birthMonth: today.getMonth() + 1,
    birthYear: null,
    id: Date.now(),
  },
];
