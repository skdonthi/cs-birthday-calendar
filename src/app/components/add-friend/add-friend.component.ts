import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { numberRangeValidator } from '../../utils/custom-validators';
import { CommonModule } from '@angular/common';
import { FriendStore } from '../../stores/friend.store';

@Component({
  selector: 'csbc-add-friend',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss',
})
export class AddFriendComponent {
  private friendStore = inject(FriendStore);
  addFriendForm: FormGroup;
  currentYear: number;
  startYear: number = 1900;

  constructor(private fb: FormBuilder) {
    this.currentYear = new Date().getFullYear();
    this.addFriendForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
        birthDay: [null, [Validators.required, numberRangeValidator(1, 31, 2)]],
        birthMonth: [null, [Validators.required, numberRangeValidator(1, 12, 2)]],
        birthYear: [null, [numberRangeValidator(this.startYear, this.currentYear, 4)]],
      },
      { validators: [this.dateValidator] } as AbstractControlOptions
    );
  }
  dateValidator(group: FormGroup): { [key: string]: any } | null {
    const day = group.get('birthDay')?.value;
    const month = group.get('birthMonth')?.value;
    const year = group.get('birthYear')?.value;

    if (!day || !month) {
      return null;
    }

    const numDay = parseInt(day, 10);
    const numMonth = parseInt(month, 10);

    if (!year) {
      if (numMonth === 2 && numDay > 29) {
        return { invalidDate: true };
      }
      if ([4, 6, 9, 11].includes(numMonth) && numDay > 30) {
        return { invalidDate: true };
      }
      if (numDay > 31) {
        return { invalidDate: true };
      }
      return null;
    }

    const numYear = parseInt(year, 10);
    const inputDate = new Date(numYear, numMonth - 1, numDay);
    const today = new Date();
    if (inputDate > today) {
      return { futureDate: true };
    }

    if (
      inputDate.getFullYear() === numYear &&
      inputDate.getMonth() === numMonth - 1 &&
      inputDate.getDate() === numDay
    ) {
      return null; // Date is valid
    } else {
      return { invalidDate: true };
    }
  }

  formatInput(controlName: string, event: Event, digits: number): void {
    const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    const truncatedValue = input.slice(0, digits);
    this.addFriendForm.get(controlName)?.setValue(truncatedValue);
  }

  onSubmit(): void {
    if (this.addFriendForm.valid) {
      this.friendStore.addFriend(this.addFriendForm.value);
      this.addFriendForm.reset();
    } else {
      this.addFriendForm.markAllAsTouched();
    }
  }

  get firstNameCtrl() {
    return this.addFriendForm.get('firstName');
  }

  get birthdayCtrl() {
    return this.addFriendForm.get('birthDay');
  }

  get birthMonthCtrl() {
    return this.addFriendForm.get('birthMonth');
  }

  get birthYearCtrl() {
    return this.addFriendForm.get('birthYear');
  }
}
