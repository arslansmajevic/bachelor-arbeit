import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAnInstanceComponent } from './search-an-instance.component';

describe('SearchAnInstanceComponent', () => {
  let component: SearchAnInstanceComponent;
  let fixture: ComponentFixture<SearchAnInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAnInstanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAnInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
