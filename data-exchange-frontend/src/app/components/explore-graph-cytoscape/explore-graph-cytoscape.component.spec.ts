import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreGraphCytoscapeComponent } from './explore-graph-cytoscape.component';

describe('ExploreGraphCytoscapeComponent', () => {
  let component: ExploreGraphCytoscapeComponent;
  let fixture: ComponentFixture<ExploreGraphCytoscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreGraphCytoscapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreGraphCytoscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
