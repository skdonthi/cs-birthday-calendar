import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFriendComponent } from './add-friend.component';
import { FriendStore } from '../../stores/friend.store';

describe('AddFriendComponent', () => {
  let component: AddFriendComponent;
  let fixture: ComponentFixture<AddFriendComponent>;
  let friendStoreMock: jasmine.SpyObj<InstanceType<typeof FriendStore>>;

  beforeEach(async () => {
    friendStoreMock = jasmine.createSpyObj('FriendStore', ['addFriend']);

    await TestBed.configureTestingModule({
      imports: [AddFriendComponent, ReactiveFormsModule],
      providers: [{ provide: FriendStore, useValue: friendStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with an invalid form', () => {
      expect(component.addFriendForm.valid).toBeFalsy();
    });

    it('should validate firstName field', () => {
      const control = component.firstNameCtrl;
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();

      control?.setValue('lorem123');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('pattern')).toBeTruthy();

      control?.setValue('lorem');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate birthDay field', () => {
      const control = component.birthdayCtrl;
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();

      control?.setValue('0');
      expect(control?.valid).toBeFalsy();

      expect(control?.hasError('outOfRange')).toBeTruthy();

      control?.setValue('32');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('outOfRange')).toBeTruthy();

      control?.setValue('15');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate birthMonth field', () => {
      const control = component.birthMonthCtrl;
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();

      control?.setValue('0');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('outOfRange')).toBeTruthy();

      control?.setValue('13');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('outOfRange')).toBeTruthy();

      control?.setValue('6');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate birthYear field', () => {
      const control = component.birthYearCtrl;
      control?.setValue('1899');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('outOfRange')).toBeTruthy();

      const futureYear = new Date().getFullYear() + 1;
      control?.setValue(futureYear.toString());
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('outOfRange')).toBeTruthy();

      control?.setValue('2000');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('Date Validation', () => {
    it('should validate valid dates', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '15',
        birthMonth: '7',
        birthYear: '2000',
      });
      expect(component.addFriendForm.valid).toBeTruthy();
    });

    it('should invalidate February 30th', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '30',
        birthMonth: '2',
        birthYear: '2000',
      });
      expect(component.addFriendForm.hasError('invalidDate')).toBeTruthy();
    });

    it('should validate February 29th on a leap year', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '29',
        birthMonth: '2',
        birthYear: '2000',
      });
      expect(component.addFriendForm.valid).toBeTruthy();
    });

    it('should invalidate February 29th on a non-leap year', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '29',
        birthMonth: '2',
        birthYear: '2001',
      });
      expect(component.addFriendForm.hasError('invalidDate')).toBeTruthy();
    });

    it('should validate 31 days in months with 31 days', () => {
      [1, 3, 5, 7, 8, 10, 12].forEach((month) => {
        component.addFriendForm.patchValue({
          firstName: 'lorem',
          birthDay: '31',
          birthMonth: month.toString(),
          birthYear: '2000',
        });
        expect(component.addFriendForm.valid).toBeTruthy();
      });
    });

    it('should invalidate 31 days in months with 30 days', () => {
      [4, 6, 9, 11].forEach((month) => {
        component.addFriendForm.patchValue({
          firstName: 'lorem',
          birthDay: '31',
          birthMonth: month.toString(),
          birthYear: '2000',
        });
        expect(component.addFriendForm.hasError('invalidDate')).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call friendStore.addFriend when form is valid', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '15',
        birthMonth: '7',
        birthYear: '2000',
      });
      component.onSubmit();
      expect(friendStoreMock.addFriend).toHaveBeenCalledWith(
        jasmine.objectContaining({
          firstName: 'lorem',
          birthDay: '15',
          birthMonth: '7',
          birthYear: '2000',
        })
      );
    });

    it('should not call friendStore.addFriend when form is invalid', () => {
      component.onSubmit();
      expect(friendStoreMock.addFriend).not.toHaveBeenCalled();
    });

    it('should reset form after successful submission', () => {
      component.addFriendForm.patchValue({
        firstName: 'lorem',
        birthDay: '15',
        birthMonth: '7',
        birthYear: '2000',
      });
      component.onSubmit();
      expect(component.addFriendForm.pristine).toBeTruthy();
      expect(component.addFriendForm.untouched).toBeTruthy();
    });
  });
});
