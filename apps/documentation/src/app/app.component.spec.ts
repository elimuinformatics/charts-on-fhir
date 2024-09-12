import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NG_DOC_CONTEXT, NgDocRootComponent } from '@ng-doc/app';
import { NgDocNavbarComponent } from '@ng-doc/app/components/navbar';
import { NgDocSidebarComponent } from '@ng-doc/app/components/sidebar';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), NoopAnimationsModule, NgDocNavbarComponent, NgDocSidebarComponent, NgDocRootComponent],
      declarations: [AppComponent],
      providers: [{ provide: NG_DOC_CONTEXT, useValue: { navigation: [] } }, provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
