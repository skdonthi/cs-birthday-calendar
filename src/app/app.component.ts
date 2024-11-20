import { Component } from '@angular/core';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddFriendComponent, FriendListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cs-birthday-calendar';
}
