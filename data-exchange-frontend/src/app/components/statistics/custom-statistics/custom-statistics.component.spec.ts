import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStatisticsComponent } from './custom-statistics.component';

describe('CustomStatisticsComponent', () => {
  let component: CustomStatisticsComponent;
  let fixture: ComponentFixture<CustomStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
