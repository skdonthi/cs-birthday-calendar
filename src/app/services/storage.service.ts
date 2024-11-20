import { Inject, Injectable, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(LOCAL_STORAGE) private storage: Storage) {}

  get(key: string) {
    return this.storage.getItem(key);
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
  remove(key: string) {
    return this.storage.removeItem(key);
  }
}
