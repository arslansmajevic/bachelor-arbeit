import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMoreInstancesComponent } from './select-more-instances.component';

describe('SelectMoreInstancesComponent', () => {
  let component: SelectMoreInstancesComponent;
  let fixture: ComponentFixture<SelectMoreInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMoreInstancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectMoreInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
