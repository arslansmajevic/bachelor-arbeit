import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlTemplatesComponent } from './sparql-templates.component';

describe('SparqlTemplatesComponent', () => {
  let component: SparqlTemplatesComponent;
  let fixture: ComponentFixture<SparqlTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparqlTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SparqlTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
