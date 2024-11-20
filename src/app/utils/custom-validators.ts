import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberRangeValidator(min: number, max: number, maxDigits: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value === null || control.value === '') {
      return null;
    }

    const value = control.value.toString();
    const pattern = new RegExp(`^\\d{1,${maxDigits}}$`);

    if (!pattern.test(value)) {
      return { invalidFormat: { value: control.value } };
    }

    const numValue = parseInt(value, 10);
    if (numValue < min || numValue > max) {
      return { outOfRange: { value: control.value, min, max } };
    }

    return null;
  };
}

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[a-zA-Z]+$/.test(control.value);
    return valid ? null : { onlyLetters: { value: control.value } };
  };
}
