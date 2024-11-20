import { Component, computed, inject, OnInit } from '@angular/core';
import { FriendStore } from '../../stores/friend.store';
import { Friend } from '../../models/friend';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'csbc-friend-list',
  standalone: true,
  imports: [],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss',
})
export class FriendListComponent implements OnInit {
  private friendStore = inject(FriendStore);
  private toastr = inject(ToastrService);

  sortedFriends = computed(() => {
    try {
      return [...this.friendStore.getFriends()].sort(this.sortByBirthday);
    } catch (error) {
      //console.error('Error fetching friends:', error);
      return [];
    }
  });

  ngOnInit() {
    this.checkBirthdays();
  }

  private checkBirthdays() {
    const todaysBirthdays = this.sortedFriends().filter((friend) =>
      this.isBirthdayToday(friend)
    );

    todaysBirthdays.forEach((friend) => {
      this.toastr.success(`Birthday, Today!`, `${friend.firstName}'s`);
    });
  }

  calculateDaysToNextBirthday(friend: Friend): number {
    const today = new Date();
    const nextBirthday = new Date(
      today.getFullYear(),
      friend.birthMonth - 1,
      friend.birthDay
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = nextBirthday.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days === 365 ? 0 : days; // Return 0 if birthday is today
  }

  calculateAge(friend: Friend): number | null {
    if (!friend.birthYear) return null;
    const today = new Date();
    const birthDate = new Date(
      friend.birthYear,
      friend.birthMonth - 1,
      friend.birthDay
    );
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  isBirthdayToday(friend: Friend): boolean {
    const today = new Date();
    return (
      today.getDate() === Number(friend.birthDay) &&
      today.getMonth() + 1 === Number(friend.birthMonth)
    );
  }

  private sortByBirthday(a: Friend, b: Friend): number {
    const getDateComponents = (obj: Friend) => {
      return {
        month: parseInt(String(obj.birthMonth), 10),
        day: parseInt(String(obj.birthDay), 10),
        year: obj.birthYear ? parseInt(String(obj.birthYear), 10) : Infinity,
      };
    };

    const aDate = getDateComponents(a);
    const bDate = getDateComponents(b);

    if (aDate.month !== bDate.month) {
      return aDate.month - bDate.month;
    }

    if (aDate.day !== bDate.day) {
      return aDate.day - bDate.day;
    }

    return aDate.year - bDate.year;
  }
}
