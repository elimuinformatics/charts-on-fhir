import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicTableComponent } from './dynamic-table.component';
import { By } from '@angular/platform-browser';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent;
  let fixture: ComponentFixture<DynamicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when data is an array of records', () => {
    it('should render column headings in title case', async () => {
      fixture.componentRef.setInput('data', [
        { 'col one': '0', 'col two': '1' },
        { 'col one': '2', 'col two': '3' },
      ]);
      fixture.detectChanges();
      const th = fixture.debugElement.queryAll(By.css('.grid-th'));
      expect(th[0].nativeElement.textContent).toBe('Col One');
      expect(th[1].nativeElement.textContent).toBe('Col Two');
    });

    it('should render grid items', async () => {
      fixture.componentRef.setInput('data', [
        { a: '0', b: '1' },
        { a: '2', b: '3' },
      ]);
      fixture.detectChanges();
      const td = fixture.debugElement.queryAll(By.css('.grid-td'));
      expect(td[0].nativeElement.textContent).toBe('0');
      expect(td[1].nativeElement.textContent).toBe('1');
      expect(td[2].nativeElement.textContent).toBe('2');
      expect(td[3].nativeElement.textContent).toBe('3');
    });

    it('should set grid-template-columns to the correct number of columns', () => {
      fixture.componentRef.setInput('data', [
        { a: '0', b: '1' },
        { a: '2', b: '3' },
      ]);
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('.grid-table'));
      expect(table.styles['gridTemplateColumns']).toBe('repeat(2, auto)');
    });
  });

  describe('when data is a 2D array', () => {
    it('should render column headings in title case', async () => {
      fixture.componentRef.setInput('data', [
        ['col one', 'col two'],
        [0, 1],
        [2, 3],
      ]);
      fixture.detectChanges();
      const th = fixture.debugElement.queryAll(By.css('.grid-th'));
      expect(th[0].nativeElement.textContent).toBe('Col One');
      expect(th[1].nativeElement.textContent).toBe('Col Two');
    });

    it('should render grid items', async () => {
      fixture.componentRef.setInput('data', [
        ['a', 'b'],
        ['0', '1'],
        ['2', '3'],
      ]);
      fixture.detectChanges();
      const td = fixture.debugElement.queryAll(By.css('.grid-td'));
      expect(td[0].nativeElement.textContent).toBe('0');
      expect(td[1].nativeElement.textContent).toBe('1');
      expect(td[2].nativeElement.textContent).toBe('2');
      expect(td[3].nativeElement.textContent).toBe('3');
    });

    it('should set grid-template-columns to the correct number of columns', () => {
      fixture.componentRef.setInput('data', [
        ['a', 'b'],
        ['0', '1'],
        ['2', '3'],
      ]);
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('.grid-table'));
      expect(table.styles['gridTemplateColumns']).toBe('repeat(2, auto)');
    });
  });
});
