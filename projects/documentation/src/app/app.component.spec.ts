import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgDocModule } from '@ng-doc/app';
import { NgDocSidebarModule } from '@ng-doc/app/components/sidebar';
import { NgDocNavbarModule } from '@ng-doc/app/components/navbar';
import { NgDocGeneratedModule } from '@ng-doc/generated';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, NgDocNavbarModule, NgDocSidebarModule, NgDocModule.forRoot(), NgDocGeneratedModule.forRoot()],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
