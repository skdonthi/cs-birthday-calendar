import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StorageService } from './services/storage.service';
import { ToastrService } from 'ngx-toastr';

describe('AppComponent', () => {
  let storageServiceMock: jasmine.SpyObj<StorageService>;
  let toastrMock: jasmine.SpyObj<ToastrService>;
  beforeEach(async () => {
    storageServiceMock = jasmine.createSpyObj('StorageService', ['get', 'set']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'cs-birthday-calendar' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CS Birthday Calendar');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'CS Birthday Calendar'
    );
  });
});
