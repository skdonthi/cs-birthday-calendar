import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Friend } from '../models/friend';
import { ToastrService } from 'ngx-toastr';
import { INITIAL_FRIENDS_LIST } from '../../../public/data';

export const FriendStore = signalStore(
  { providedIn: 'root' },
  withState<{ friends: Friend[] }>({ friends: [] }),
  withComputed(({ friends }) => ({
    getFriends: computed(() => friends()),
  })),
  withMethods((store, storageService = inject(StorageService), toastr = inject(ToastrService)) => ({
    addFriend(friend: Omit<Friend, 'id'>) {
      const newFriend = { ...friend, id: Date.now() };
      patchState(store, (state) => ({
        friends: [...state.friends, newFriend],
      }));
      this.notifyIfBirthdayIsToday(newFriend);
      this.updateFriendsList();
    },

    notifyIfBirthdayIsToday(friend: Friend) {
      const today = new Date();
      const isTodayBirthday =
        today.getDate() === Number(friend.birthDay) && today.getMonth() + 1 === Number(friend.birthMonth);
      if (isTodayBirthday) {
        toastr.success(`Birthday, Today!`, `${friend.firstName}'s`);
      }
    },

    updateFriendsList() {
      storageService.set('friends', JSON.stringify(store.friends()));
    },
  })),
  withHooks({
    onInit: (store) => {
      const storageService = inject(StorageService);
      const storedFriends = storageService.get('friends');
      if (storedFriends) {
        patchState(store, { friends: JSON.parse(storedFriends) });
      } else {
        INITIAL_FRIENDS_LIST.forEach((f) => store.addFriend(f));
      }
    },
  })
);
