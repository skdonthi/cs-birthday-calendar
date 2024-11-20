import { Component, inject } from '@angular/core';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddFriendComponent, FriendListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CS Birthday Calendar';
  storage = inject(StorageService);
  constructor() {
    if (!this.storage.get('friends')) {
      const today = new Date();
      this.storage.set(
        'friends',
        JSON.stringify([
          {
            firstName: 'shiva',
            birthDay: '14',
            birthMonth: '11',
            birthYear: '1994',
            id: 1732112102606,
          },
          {
            firstName: 'krishna',
            birthDay: '14',
            birthMonth: '8',
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
        ])
      );
    }
  }
}
