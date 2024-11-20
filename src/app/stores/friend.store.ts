import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Friend } from '../models/friend';

export const FriendStore = signalStore(
  { providedIn: 'root' },
  withState<{ friends: Friend[] }>({ friends: [] }),
  withComputed(({ friends }) => ({
    getFriends: computed(() => friends()),
  })),
  withMethods((store, storageService = inject(StorageService)) => ({
    addFriend(friend: Omit<Friend, 'id'>) {
      const newFriend = { ...friend, id: Date.now() };
      patchState(store, (state) => ({
        friends: [...state.friends, newFriend],
      }));
      this.updateLocalStorage();
    },

    updateLocalStorage() {
      storageService.set('friends', JSON.stringify(store.friends()));
    },
  })),
  withHooks({
    onInit: (store) => {
      const storageService = inject(StorageService);
      const storedFriends = storageService.get('friends');
      if (storedFriends) {
        patchState(store, { friends: JSON.parse(storedFriends) });
      }
    },
  })
);
