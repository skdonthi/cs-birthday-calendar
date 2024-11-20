import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { FriendStore } from '../../stores/friend.store';
import { Friend } from '../../models/friend';

export type FriendsDisplay = Friend & {
  isBirthdayToday: boolean;
  age: number | null;
  daysToNextBirthday: number;
};
@Component({
  selector: 'csbc-friend-list',
  standalone: true,
  imports: [],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss',
})
export class FriendListComponent implements OnInit {
  private friendStore = inject(FriendStore);

  sortedFriends: Signal<FriendsDisplay[]> = computed(() => {
    try {
      return [...this.friendStore.getFriends()]
        .map((f) => ({
          ...f,
          isBirthdayToday: this.isBirthdayToday(f),
          age: this.calculateAge(f),
          daysToNextBirthday: this.calculateDaysToNextBirthday(f),
        }))
        .sort(this.sortByBirthday);
    } catch (error) {
      return [];
    }
  });

  ngOnInit() {}

  calculateDaysToNextBirthday(friend: Friend): number {
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), friend.birthMonth - 1, friend.birthDay);
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = nextBirthday.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  }

  isBirthdayToday(friend: Friend): boolean {
    const today = new Date();
    return today.getDate() === Number(friend.birthDay) && today.getMonth() + 1 === Number(friend.birthMonth);
  }

  calculateAge(friend: Friend): number | null {
    if (!friend.birthYear) return null;
    const today = new Date();
    const birthDate = new Date(friend.birthYear, friend.birthMonth - 1, friend.birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 0 ? age : 0;
  }

  private sortByBirthday(a: Friend, b: Friend): number {
    if (a.birthMonth !== b.birthMonth) {
      return a.birthMonth - b.birthMonth;
    }

    if (a.birthDay !== b.birthDay) {
      return a.birthDay - b.birthDay;
    }

    return (a.birthYear || Infinity) - (b.birthYear || Infinity);
  }
}
