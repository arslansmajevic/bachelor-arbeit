import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlEndpointComponent } from './sparql-endpoint.component';

describe('SparqlEndpointComponent', () => {
  let component: SparqlEndpointComponent;
  let fixture: ComponentFixture<SparqlEndpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparqlEndpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SparqlEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
