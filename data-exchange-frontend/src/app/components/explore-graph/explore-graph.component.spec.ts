import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreGraphComponent } from './explore-graph.component';

describe('ExploreGraphComponent', () => {
  let component: ExploreGraphComponent;
  let fixture: ComponentFixture<ExploreGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
