import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendListComponent } from './friend-list.component';
import { FriendStore } from '../../stores/friend.store';
import { Friend } from '../../models/friend';

describe('FriendListComponent', () => {
  let component: FriendListComponent;
  let fixture: ComponentFixture<FriendListComponent>;
  let friendStoreMock: jasmine.SpyObj<InstanceType<typeof FriendStore>>;

  beforeEach(async () => {
    friendStoreMock = jasmine.createSpyObj('FriendStore', ['getFriends']);

    await TestBed.configureTestingModule({
      imports: [FriendListComponent],
      providers: [{ provide: FriendStore, useValue: friendStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sortedFriends', () => {
    it('should return sorted friends', () => {
      const mockFriends: Friend[] = [
        { id: 1, firstName: 'Alice', birthMonth: 5, birthDay: 15 },
        { id: 2, firstName: 'Bob', birthMonth: 3, birthDay: 20 },
        { id: 3, firstName: 'Charlie', birthMonth: 5, birthDay: 10 },
      ];
      friendStoreMock.getFriends.and.returnValue(mockFriends);

      const sortedFriends = component.sortedFriends();

      expect(sortedFriends[0].firstName).toBe('Bob');
      expect(sortedFriends[1].firstName).toBe('Charlie');
      expect(sortedFriends[2].firstName).toBe('Alice');
    });

    it('should handle errors and return an empty array', () => {
      const sortedFriends = component.sortedFriends();
      expect(sortedFriends).toEqual([]);
    });
  });

  describe('calculateDaysToNextBirthday', () => {
    it('should calculate days to next birthday correctly', () => {
      const today = new Date();
      const friend: Friend = {
        id: 1,
        firstName: 'Alice',
        birthMonth: today.getMonth() + 1,
        birthDay: today.getDate() + 1,
      };
      const days = component.calculateDaysToNextBirthday(friend);
      expect(days).toBe(1);
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const today = new Date();
      const friend: Friend = {
        id: 1,
        firstName: 'Alice',
        birthYear: today.getFullYear() - 30,
        birthMonth: today.getMonth() + 1,
        birthDay: today.getDate(),
      };

      const age = component.calculateAge(friend);

      expect(age).toBe(30);
    });

    it('should return null if birthYear is not provided', () => {
      const friend: Friend = {
        id: 1,
        firstName: 'Alice',
        birthMonth: 1,
        birthDay: 1,
      };

      const age = component.calculateAge(friend);

      expect(age).toBeNull();
    });
  });
});
